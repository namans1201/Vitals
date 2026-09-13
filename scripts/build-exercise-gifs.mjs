import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const outputDir = path.resolve("public", "exercises");
const magick = process.env.IMAGEMAGICK_BIN || "magick";

for (const file of fs.readdirSync(outputDir).filter((name) => name.endsWith(".png"))) {
  const slug = path.basename(file, ".png");
  const gif = path.join(outputDir, `${slug}.gif`);
  if (fs.existsSync(gif)) continue;

  const source = path.join(outputDir, file);
  const identify = execFileSync(magick, ["identify", "-format", "%w %h", source], { encoding: "utf8" });
  const [width, height] = identify.trim().split(/\s+/).map(Number);
  const half = Math.floor(width / 2);
  const left = path.join(outputDir, `.${slug}-left.png`);
  const right = path.join(outputDir, `.${slug}-right.png`);

  execFileSync(magick, [source, "-crop", `${half}x${height}+0+0`, "+repage", left]);
  execFileSync(magick, [source, "-crop", `${half}x${height}+${half}+0`, "+repage", right]);
  execFileSync(magick, [left, right, left, "-resize", "768x768>", "-set", "delay", "65", "-loop", "0", gif]);
  fs.rmSync(left, { force: true });
  fs.rmSync(right, { force: true });
}
