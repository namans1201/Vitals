import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const dir = path.resolve("public", "exercises");
const magick = process.env.IMAGEMAGICK_BIN || "C:/Program Files/ImageMagick-7.1.2-Q16-HDRI/magick.exe";

for (const file of fs.readdirSync(dir).filter((name) => name.endsWith(".png"))) {
  const slug = path.basename(file, ".png");
  const source = path.join(dir, file);
  const output = path.join(dir, `${slug}.gif`);
  const temp = path.join(dir, `.${slug}.safe.gif`);
  execFileSync(magick, [source, source, source, "-set", "delay", "90", "-loop", "0", temp]);
  fs.renameSync(temp, output);
}
