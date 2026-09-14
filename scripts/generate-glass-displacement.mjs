/**
 * Generates the displacement maps behind the app's liquid-glass refraction.
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
 * Output is smooth and mostly flat, so PNG crushes it to a couple of KB.
 *
 * Regenerate every surface with:
 *   node scripts/generate-glass-displacement.mjs
 */
import { stat } from "node:fs/promises";
import sharp from "sharp";

/** Each glass surface that needs a map. Sizes track the CSS they belong to. */
const SURFACES = [
  // The login card. Fixed width; height measured from the rendered card.
  { out: "public/login-art/glass-rim.png", width: 372, height: 321, radius: 26, rim: 26 },
  // The nav bars. Their width varies — the desktop bar is inset and capped at
  // max-w-5xl, the phone bars are full-bleed — so this map gets stretched
  // horizontally at render time. That is fine here and would not be on the
  // card: the bar's height is fixed, and on a surface this shallow it is the
  // top and bottom rims that read, not the ends.
  { out: "public/login-art/nav-rim.png", width: 1024, height: 57, radius: 16, rim: 13 },
];

/** Signed distance to a rounded rectangle. Negative inside. */
function sdRoundRect(px, py, halfW, halfH, r) {
  const qx = Math.abs(px) - (halfW - r);
  const qy = Math.abs(py) - (halfH - r);
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
}

/** Convex squircle height profile, t = 0 at the rim, 1 at the flat interior. */
function slope(t) {
  const u = 1 - Math.min(Math.max(t, 0), 1);
  const base = 1 - u ** 4;
  if (base <= 1e-6) return 1; // clamp the vertical tangent right at the edge
  return Math.min(u ** 3 / base ** 0.75, 1);
}

async function generate({ out, width: W, height: H, radius, rim }) {
  const halfW = W / 2;
  const halfH = H / 2;

  // One pass: per pixel, find the inward normal from the SDF gradient and
  // scale it by the surface slope at that depth.
  const mags = new Float32Array(W * H * 2);
  let maxMag = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const px = x + 0.5 - halfW;
      const py = y + 0.5 - halfH;
      const depth = -sdRoundRect(px, py, halfW, halfH, radius); // px inside
      if (depth <= 0 || depth > rim) continue; // outside, or past the rim

      const e = 0.75;
      const gx =
        sdRoundRect(px + e, py, halfW, halfH, radius) -
        sdRoundRect(px - e, py, halfW, halfH, radius);
      const gy =
        sdRoundRect(px, py + e, halfW, halfH, radius) -
        sdRoundRect(px, py - e, halfW, halfH, radius);
      const len = Math.hypot(gx, gy) || 1;
      const m = slope(depth / rim);

      const i = (y * W + x) * 2;
      mags[i] = (-gx / len) * m;
      mags[i + 1] = (-gy / len) * m;
      maxMag = Math.max(maxMag, Math.abs(mags[i]), Math.abs(mags[i + 1]));
    }
  }

  const buf = Buffer.alloc(W * H * 3);
  for (let p = 0; p < W * H; p++) {
    buf[p * 3] = Math.round(128 + (mags[p * 2] / (maxMag || 1)) * 127);
    buf[p * 3 + 1] = Math.round(128 + (mags[p * 2 + 1] / (maxMag || 1)) * 127);
    buf[p * 3 + 2] = 128;
  }

  await sharp(buf, { raw: { width: W, height: H, channels: 3 } })
    .png({ compressionLevel: 9, palette: false })
    .toFile(out);

  const { size } = await stat(out);
  console.log(`${out}  ${W}x${H}  ${(size / 1024).toFixed(1)}KB`);
}

for (const surface of SURFACES) await generate(surface);
