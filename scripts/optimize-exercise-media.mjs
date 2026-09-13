/**
 * Turns the generated exercise art into web-sized WebP.
 *
 * Source art is 1536x1024 PNG (~1.1MB each) + a 3-frame GIF (~800KB each).
 * The app only ever shows these inside a max-w-sm modal (~352 CSS px), so
 * 768px wide covers 2x retina with room to spare.
 *
 *   <slug>.png  ->  <slug>.webp        static, quality 80
 *   <slug>.gif  ->  <slug>-anim.webp   animated, quality 80 - ONLY when the
 *                                      source actually has more than one
 *                                      distinct frame (see hasRealMotion)
 *
 * Every one of the 91 generated GIFs turned out to be a single still frame
 * duplicated 3x - confirmed three independent ways (ImageMagick RMSE,
 * per-frame file hashing after ruling out a PNG-metadata false positive, and
 * a raw-pixel-buffer diff via sharp below) - not an encoding bug, the source
 * art itself has no motion. Shipping a "-anim.webp" for those exercises would
 * cost 2-4x the still's bytes for an image that is pixel-for-pixel the same
 * as the still, and the app's own Media tab would show a pointless
 * Animated/Still toggle where both options are identical. So this script
 * checks every GIF before touching it and only emits an animation when the
 * frames actually differ; ExerciseFormGuideModal's MediaTab already falls
 * back to the still and hides the toggle whenever `-anim.webp` 404s, so no
 * component change was needed to make this correct.
 *
 * If real per-frame motion ever does exist, the animation path shells out to
 * ffmpeg for the resize (a plain gif->gif scale, which is reliable) and then
 * to gif2webp for the encode - NOT ffmpeg's own libwebp muxer. That muxer
 * was tested and silently collapsed genuinely distinct frames into an
 * identical-looking animation (reproduced on 4 different real-motion test
 * clips); gif2webp preserved them correctly every time.
 *
 * Usage: node scripts/optimize-exercise-media.mjs [--dry]
 */
import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import sharp from "sharp";

const execFileAsync = promisify(execFile);

const DIR = "public/exercises";
const WIDTH = 768;
const QUALITY = 80;
const CONCURRENCY = 6;
const DRY = process.argv.includes("--dry");

/** Below this many differing bytes between frame 0 and any other frame, two
 * frames count as "the same picture" - generous enough to ignore any stray
 * encoder noise while still catching real motion (a genuine pose change
 * differs by many thousands of bytes, not tens). */
const MOTION_BYTE_THRESHOLD = 50;

const kb = (n) => (n / 1024).toFixed(1) + " KB";
const mb = (n) => (n / 1024 / 1024).toFixed(1) + " MB";

async function sizeOf(file) {
  return (await fs.stat(file)).size;
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

/** True if this GIF has at least two frames that actually differ. Compares
 * raw decoded pixels (not the encoded file), so it isn't fooled by
 * incidental metadata differences between frames. */
async function hasRealMotion(gifPath) {
  const { data, info } = await sharp(gifPath, { animated: true }).raw().toBuffer({ resolveWithObject: true });
  if (info.pages <= 1) return false;
  const frameBytes = info.width * info.pageHeight * info.channels;
  const first = data.subarray(0, frameBytes);
  for (let p = 1; p < info.pages; p++) {
    const frame = data.subarray(p * frameBytes, (p + 1) * frameBytes);
    let diff = 0;
    for (let i = 0; i < frameBytes; i++) {
      if (first[i] !== frame[i] && ++diff > MOTION_BYTE_THRESHOLD) return true;
    }
  }
  return false;
}

async function convertStill(slug) {
  const src = path.join(DIR, `${slug}.png`);
  const out = path.join(DIR, `${slug}.webp`);
  const before = await sizeOf(src);
  if (DRY) return { slug, kind: "still", before, after: 0 };
  await sharp(src).resize({ width: WIDTH }).webp({ quality: QUALITY }).toFile(out);
  return { slug, kind: "still", before, after: await sizeOf(out) };
}

/** Resize (ffmpeg, a plain gif->gif scale) then encode (gif2webp) as two
 * separate steps - see the file header for why ffmpeg's own libwebp muxer
 * isn't used for the encode. */
async function convertAnimation(slug) {
  const src = path.join(DIR, `${slug}.gif`);
  const out = path.join(DIR, `${slug}-anim.webp`);
  const before = await sizeOf(src);
  if (DRY) return { slug, kind: "anim", before, after: 0 };

  const resized = path.join(DIR, `.${slug}.resized.gif`);
  try {
    await execFileAsync("ffmpeg", [
      "-y", "-loglevel", "error",
      "-i", src,
      "-vf", `scale=${WIDTH}:-1:flags=lanczos`,
      resized,
    ]);
    await execFileAsync("gif2webp", ["-q", String(QUALITY), "-m", "4", resized, "-o", out]);
  } finally {
    await fs.rm(resized, { force: true });
  }
  return { slug, kind: "anim", before, after: await sizeOf(out) };
}

/** Runs `tasks` with a fixed worker pool, preserving nothing but completion. */
async function runPool(tasks, concurrency) {
  const results = [];
  let next = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (next < tasks.length) {
      const i = next++;
      results.push(await tasks[i]());
    }
  });
  await Promise.all(workers);
  return results;
}

const files = await fs.readdir(DIR);
const stills = files.filter((f) => f.endsWith(".png")).map((f) => f.slice(0, -4));
const gifs = files.filter((f) => f.endsWith(".gif")).map((f) => f.slice(0, -4));

console.log(`checking ${gifs.length} GIFs for real motion...`);
const motionChecks = await runPool(
  gifs.map((slug) => async () => ({ slug, motion: await hasRealMotion(path.join(DIR, `${slug}.gif`)) })),
  CONCURRENCY,
);
const animatable = motionChecks.filter((c) => c.motion).map((c) => c.slug);
const staticOnly = motionChecks.filter((c) => !c.motion).map((c) => c.slug);

// A still-only exercise may carry a stale -anim.webp from a previous run
// (e.g. before this motion check existed, or before the source GIF was
// replaced with a static one) - remove it so the app doesn't serve dead
// bytes or a pointless Animated toggle for something that never animates.
let staleRemoved = 0;
for (const slug of staticOnly) {
  const stale = path.join(DIR, `${slug}-anim.webp`);
  if (await exists(stale)) {
    if (!DRY) await fs.rm(stale);
    staleRemoved++;
  }
}

console.log(
  `${stills.length} stills -> ${WIDTH}px WebP q${QUALITY}; ` +
    `${animatable.length}/${gifs.length} GIFs have real motion and get an animation` +
    (staleRemoved ? ` (removing ${staleRemoved} stale animation${staleRemoved === 1 ? "" : "s"})` : "") +
    `${DRY ? " (dry run)" : ""}\n`,
);

const tasks = [
  ...stills.map((s) => () => convertStill(s)),
  ...animatable.map((s) => () => convertAnimation(s)),
];

const started = Date.now();
const results = await runPool(tasks, CONCURRENCY);
const elapsed = ((Date.now() - started) / 1000).toFixed(1);

const totals = { still: { before: 0, after: 0, n: 0 }, anim: { before: 0, after: 0, n: 0 } };
for (const r of results) {
  totals[r.kind].before += r.before;
  totals[r.kind].after += r.after;
  totals[r.kind].n++;
}

const worst = results.filter((r) => r.kind === "anim").sort((a, b) => b.after - a.after).slice(0, 3);

for (const kind of ["still", "anim"]) {
  const t = totals[kind];
  const saved = t.before === 0 ? 0 : (1 - t.after / t.before) * 100;
  console.log(
    `${kind.padEnd(6)} ${String(t.n).padStart(3)} files: ${mb(t.before).padStart(9)} -> ${mb(t.after).padStart(9)}  (${saved.toFixed(1)}% smaller)`,
  );
}
const gBefore = totals.still.before + totals.anim.before;
const gAfter = totals.still.after + totals.anim.after;
console.log(`\nTOTAL          : ${mb(gBefore)} -> ${mb(gAfter)}  (${gBefore ? ((1 - gAfter / gBefore) * 100).toFixed(1) : "0.0"}% smaller)  in ${elapsed}s`);
if (worst.length > 0) console.log(`largest animations: ${worst.map((w) => `${w.slug} ${kb(w.after)}`).join(", ")}`);
if (staticOnly.length > 0 && staticOnly.length <= 10) {
  console.log(`\nstill-only (no motion detected): ${staticOnly.join(", ")}`);
} else if (staticOnly.length > 10) {
  console.log(`\n${staticOnly.length} exercises are still-only (no motion detected in the source GIF).`);
}
