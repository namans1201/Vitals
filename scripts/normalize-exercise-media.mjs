import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const dir = path.resolve("public", "exercises");
const magick = process.env.IMAGEMAGICK_BIN || "C:/Program Files/ImageMagick-7.1.2-Q16-HDRI/magick.exe";
const width = 1536;
const height = 1024;

for (const file of fs.readdirSync(dir).filter((name) => name.endsWith(".png")).sort()) {
  const source = path.join(dir, file);
  const temp = path.join(dir, `.${file}.normalized`);

  execFileSync(magick, [
    source,
    "-background", "white",
    "-alpha", "remove",
    "-alpha", "off",
    "-resize", `${width}x${height}`,
    "-gravity", "center",
    "-extent", `${width}x${height}`,
    "-strip",
    temp,
  ]);

  fs.renameSync(temp, source);
}

console.log(`Normalized PNG canvases to ${width}x${height}.`);
