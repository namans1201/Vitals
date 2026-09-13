/**
 * Turns the generated exercise art into web-sized WebP.
 *
 * Source art is 1536x1024 PNG (~1.1MB each) + a 3-frame GIF (~800KB each).
 * The app only ever shows these inside a max-w-sm modal (~352 CSS px), so
 * 768px wide covers 2x retina with room to spare.
 *
 *   <slug>.png  ->  <slug>.webp        static, quality 80
 *   <slug>.gif  ->  <slug>-anim.webp   animated, quality 80, frame delays preserved
 *
 * ffmpeg beats gif2webp on size here (92KB vs 113KB on the worst case) and
 * preserves the per-frame delay and infinite loop, so the animation path
 * shells out to it rather than using libwebp's own converter.
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

const kb = (n) => (n / 1024).toFixed(1) + " KB";
const mb = (n) => (n / 1024 / 1024).toFixed(1) + " MB";

async function sizeOf(file) {
  return (await fs.stat(file)).size;
}

async function convertStill(slug) {
  const src = path.join(DIR, `${slug}.png`);
  const out = path.join(DIR, `${slug}.webp`);
  const before = await sizeOf(src);
  if (DRY) return { slug, kind: "still", before, after: 0 };
  await sharp(src).resize({ width: WIDTH }).webp({ quality: QUALITY }).toFile(out);
  return { slug, kind: "still", before, after: await sizeOf(out) };
}

async function convertAnimation(slug) {
  const src = path.join(DIR, `${slug}.gif`);
  const out = path.join(DIR, `${slug}-anim.webp`);
  const before = await sizeOf(src);
  if (DRY) return { slug, kind: "anim", before, after: 0 };
  await execFileAsync("ffmpeg", [
    "-y", "-loglevel", "error",
    "-i", src,
    "-vf", `scale=${WIDTH}:-1:flags=lanczos`,
    "-c:v", "libwebp",
    "-lossless", "0",
    "-q:v", String(QUALITY),
    "-loop", "0",
    "-preset", "picture",
    "-an",
    "-fps_mode", "passthrough",
    out,
  ]);
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
const anims = files.filter((f) => f.endsWith(".gif")).map((f) => f.slice(0, -4));

console.log(`${stills.length} stills, ${anims.length} animations -> ${WIDTH}px WebP q${QUALITY}${DRY ? " (dry run)" : ""}\n`);

const tasks = [
  ...stills.map((s) => () => convertStill(s)),
  ...anims.map((s) => () => convertAnimation(s)),
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
console.log(`\nTOTAL          : ${mb(gBefore)} -> ${mb(gAfter)}  (${((1 - gAfter / gBefore) * 100).toFixed(1)}% smaller)  in ${elapsed}s`);
console.log(`largest animations: ${worst.map((w) => `${w.slug} ${kb(w.after)}`).join(", ")}`);
