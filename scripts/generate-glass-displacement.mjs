/**
 * Generates the displacement map behind the login card's rim refraction.
 *
 * Apple's Liquid Glass bends the backdrop only where the glass is thick — at
 * the rim — and leaves the flat interior alone. `backdrop-filter` cannot do
 * that on its own: none of its functions moves a pixel, so blur alone gives
 * frosted glass with no lensing. The trick (documented at
 * https://kube.io/blog/liquid-glass-css-svg/) is to hand an <feDisplacementMap>
 * a map image whose red channel encodes X displacement and green channel
 * encodes Y, with 128 meaning "don't move this pixel".
 *
 * So: 128 grey across the whole interior, and a band around the edge whose
 * colour pushes the sampled backdrop inward, hardest right at the boundary.
 * The falloff follows the convex-squircle height profile Apple's own glass
 * uses, y = (1 - (1-x)^4)^(1/4), differentiated to get the surface slope.
 *
 * Output is a smooth, mostly-flat image, so PNG crushes it to a couple of KB.
 * Run with: node scripts/generate-glass-displacement.mjs
 */
import sharp from "sharp";

const W = 372; // card width  (see .login-card max-width)
const H = 321; // card height (measured; the map stretches if this drifts)
const RADIUS = 26; // must track .login-card border-radius
const RIM = 26; // how far in from the edge the lensing reaches, px

/** Signed distance to a rounded rectangle. Negative inside. */
function sdRoundRect(px, py, halfW, halfH, r) {
  const qx = Math.abs(px) - (halfW - r);
  const qy = Math.abs(py) - (halfH - r);
  const ax = Math.max(qx, 0);
  const ay = Math.max(qy, 0);
  return Math.hypot(ax, ay) + Math.min(Math.max(qx, qy), 0) - r;
}

/** Convex squircle height profile, t = 0 at the rim, 1 at the flat interior. */
function slope(t) {
  const u = 1 - Math.min(Math.max(t, 0), 1);
  const base = 1 - u ** 4;
  if (base <= 1e-6) return 1; // clamp the vertical tangent right at the edge
  return Math.min(u ** 3 / base ** 0.75, 1);
}

const halfW = W / 2;
const halfH = H / 2;
const buf = Buffer.alloc(W * H * 3);

// One pass: per pixel, find the inward normal from the SDF gradient and scale
// it by the surface slope at that depth.
let maxMag = 0;
const mags = new Float32Array(W * H * 2);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const px = x + 0.5 - halfW;
    const py = y + 0.5 - halfH;
    const d = sdRoundRect(px, py, halfW, halfH, RADIUS);
    const depth = -d; // px inside the shape
    const i = (y * W + x) * 2;
    if (d > 0 || depth > RIM) continue; // outside, or past the rim: no bending

    // inward normal = -gradient of the SDF
    const e = 0.75;
    const gx = sdRoundRect(px + e, py, halfW, halfH, RADIUS) - sdRoundRect(px - e, py, halfW, halfH, RADIUS);
    const gy = sdRoundRect(px, py + e, halfW, halfH, RADIUS) - sdRoundRect(px, py - e, halfW, halfH, RADIUS);
    const len = Math.hypot(gx, gy) || 1;
    const m = slope(depth / RIM);
    mags[i] = (-gx / len) * m;
    mags[i + 1] = (-gy / len) * m;
    maxMag = Math.max(maxMag, Math.abs(mags[i]), Math.abs(mags[i + 1]));
  }
}

for (let p = 0; p < W * H; p++) {
  const nx = mags[p * 2] / (maxMag || 1);
  const ny = mags[p * 2 + 1] / (maxMag || 1);
  buf[p * 3] = Math.round(128 + nx * 127);
  buf[p * 3 + 1] = Math.round(128 + ny * 127);
  buf[p * 3 + 2] = 128;
}

const out = "public/login-art/glass-rim.png";
await sharp(buf, { raw: { width: W, height: H, channels: 3 } })
  .png({ compressionLevel: 9, palette: false })
  .toFile(out);

const { size } = await import("node:fs").then((fs) => fs.promises.stat(out));
console.log(`${out}  ${W}x${H}  ${(size / 1024).toFixed(1)}KB`);
