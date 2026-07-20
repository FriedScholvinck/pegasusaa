import { readFile, readdir, stat, unlink, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import sharp from "sharp";

const assetDir = new URL("../public/assets/migrated/", import.meta.url);
const contentPath = new URL("../src/data/content.json", import.meta.url);
const manifestPath = new URL("../migration/asset-manifest.json", import.meta.url);
const files = await readdir(assetDir);
const replacements = new Map();

for (const filename of files) {
  const extension = extname(filename).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(extension)) continue;

  const input = join(assetDir.pathname, filename);
  const outputName = `${filename.slice(0, -extension.length)}.webp`;
  const output = join(assetDir.pathname, outputName);
  const inputSize = (await stat(input)).size;

  await sharp(input)
    .rotate()
    .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 88, effort: 5, smartSubsample: true })
    .toFile(output);

  const outputSize = (await stat(output)).size;
  if (outputSize < inputSize) {
    await unlink(input);
    replacements.set(`/assets/migrated/${filename}`, `/assets/migrated/${outputName}`);
  } else {
    await unlink(output);
  }
}

const replacePaths = (value) => {
  let output = value;
  for (const [from, to] of replacements) output = output.split(from).join(to);
  return output;
};

const content = await readFile(contentPath, "utf8");
const manifest = await readFile(manifestPath, "utf8");
await writeFile(contentPath, replacePaths(content));
await writeFile(manifestPath, replacePaths(manifest));

console.log(`Optimized ${replacements.size} assets`);
