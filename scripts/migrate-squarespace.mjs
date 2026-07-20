import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import { load } from "cheerio";

const exportPath = process.argv[2] ?? process.env.SQUARESPACE_EXPORT;
if (!exportPath) {
  throw new Error("Provide an export path as an argument or SQUARESPACE_EXPORT.");
}
const sitemapUrl = "https://www.pegasusaa.com/sitemap.xml";
const outputDir = new URL("../src/data/", import.meta.url);
const assetDir = new URL("../public/assets/migrated/", import.meta.url);
const reportDir = new URL("../migration/", import.meta.url);
const logoUrl =
  "https://images.squarespace-cdn.com/content/v1/5b505f78365f025b0e4f9ebe/5528637e-d65f-4c5e-8bca-c3ac7713f12b/logo+copy.png?format=original";

const xml = await readFile(exportPath, "utf8");
const sitemapXml = await fetch(sitemapUrl).then((response) => {
  if (!response.ok) throw new Error(`Could not load sitemap: ${response.status}`);
  return response.text();
});

const decode = (value = "") =>
  load(`<span>${value}</span>`, null, false)("span").text();

const readTag = (source, name) => {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = source.match(new RegExp(`<${escaped}>([\\s\\S]*?)</${escaped}>`));
  if (!match) return "";
  return match[1].replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "");
};

const normalizeUrl = (value) => {
  if (!value) return "";
  const url = new URL(decode(value), "https://www.pegasusaa.com");
  url.search = "";
  url.hash = "";
  return url.toString();
};

const normalizePath = (value) => {
  const url = new URL(decode(value), "https://www.pegasusaa.com");
  return url.pathname.replace(/\/$/, "") || "/";
};

const sanitizeHtml = (html) => {
  const $ = load(html, null, false);
  $("script, style, iframe").remove();
  $("*").each((_, element) => {
    const attributes = Object.keys(element.attribs ?? {});
    for (const attribute of attributes) {
      if (
        attribute === "style" ||
        attribute === "class" ||
        attribute.startsWith("data-") ||
        attribute === "target"
      ) {
        $(element).removeAttr(attribute);
      }
    }
  });
  $("a").each((_, element) => {
    const href = $(element).attr("href");
    if (href?.startsWith("http://www.pegasusaa.com")) {
      $(element).attr("href", href.replace("http://www.pegasusaa.com", ""));
    }
    if (href?.startsWith("https://www.pegasusaa.com")) {
      $(element).attr("href", href.replace("https://www.pegasusaa.com", ""));
    }
  });
  return $.html().replace(/&nbsp;/g, " ").trim();
};

const parseBlocks = (body) => {
  const withoutCaptions = body
    .replace(/\[caption[^\]]*\]/g, "")
    .replace(/\[\/caption\]/g, "");
  const $ = load(withoutCaptions, null, false);
  const blocks = [];

  $(".sqs-html-content, img").each((_, element) => {
    const current = $(element);
    if (element.name === "img") {
      if (current.parents(".sqs-html-content").length) return;
      blocks.push({
        type: "image",
        source: normalizeUrl(current.attr("src")),
        alt: decode(current.attr("alt") ?? "").replace(/\s+/g, " ").trim(),
      });
      return;
    }

    const html = sanitizeHtml(current.html() ?? "");
    const text = load(html, null, false).text().replace(/\s+/g, " ").trim();
    if (text) blocks.push({ type: "html", html });
  });

  return blocks.filter((block, index) => {
    if (index === 0) return true;
    const previous = blocks[index - 1];
    return JSON.stringify(previous) !== JSON.stringify(block);
  });
};

const itemMatches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
const pages = itemMatches.map((match) => {
  const item = match[1];
  const titleSource = readTag(item, "title");
  const body = readTag(item, "content:encoded");
  return {
    path: normalizePath(readTag(item, "link")),
    title: decode(titleSource).replace(/<[^>]+>/g, "").trim(),
    type: readTag(item, "wp:post_type"),
    status: readTag(item, "wp:status"),
    publishedAt: readTag(item, "pubDate"),
    author: decode(readTag(item, "dc:creator")).trim(),
    blocks: parseBlocks(body),
  };
});

const sitemapPaths = new Set(
  [...sitemapXml.matchAll(/<loc>([\s\S]*?)<\/loc>/g)]
    .map((match) => normalizePath(match[1]))
    .filter((path) => path !== "/sitemap.xml"),
);
sitemapPaths.add("/privacy-policy");
sitemapPaths.add("/home");

for (const page of pages) {
  page.public = sitemapPaths.has(page.path);
}

const sitemapImages = [...sitemapXml.matchAll(/<image:loc>([\s\S]*?)<\/image:loc>/g)].map(
  (match) => normalizeUrl(match[1]),
);
const contentImages = pages.flatMap((page) =>
  page.blocks.filter((block) => block.type === "image").map((block) => block.source),
);
const contentFiles = pages.flatMap((page) =>
  page.blocks.flatMap((block) => {
    if (block.type !== "html") return [];
    const $ = load(block.html, null, false);
    return $("a[href^='/s/']")
      .map((_, element) => normalizeUrl($(element).attr("href")))
      .get();
  }),
);
const assetSources = [
  ...new Set([logoUrl, ...sitemapImages, ...contentImages, ...contentFiles].map(normalizeUrl)),
].filter(Boolean);

const extensionFor = (source, contentType) => {
  const existing = extname(new URL(source).pathname).toLowerCase();
  if (existing && existing.length <= 6) return existing;
  if (contentType.includes("png")) return ".png";
  if (contentType.includes("webp")) return ".webp";
  if (contentType.includes("svg")) return ".svg";
  return ".jpg";
};

const stemFor = (source) => {
  const raw = decodeURIComponent(basename(new URL(source).pathname))
    .replace(/\+/g, "-")
    .replace(/\.[^.]+$/, "")
    .normalize("NFKD")
    .replace(/[^\w-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return raw || "asset";
};

await mkdir(assetDir, { recursive: true });
await mkdir(outputDir, { recursive: true });
await mkdir(reportDir, { recursive: true });

const assetMap = {};
const failures = [];
const existingAssets = await readdir(assetDir);

const download = async (source) => {
  try {
    const hash = createHash("sha256").update(source).digest("hex").slice(0, 8);
    const prefix = `${stemFor(source)}-${hash}`;
    const existing = existingAssets.find((filename) => filename.startsWith(`${prefix}.`));
    if (existing) {
      assetMap[source] = `/assets/migrated/${existing}`;
      return;
    }
    const requestUrl = source.includes("images.squarespace-cdn.com")
      ? `${source}?format=original`
      : source;
    const response = await fetch(requestUrl);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const contentType = response.headers.get("content-type") ?? "";
    const extension = extensionFor(source, contentType);
    const filename = `${prefix}${extension}`;
    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(join(assetDir.pathname, filename), buffer);
    assetMap[source] = `/assets/migrated/${filename}`;
  } catch (error) {
    failures.push({ source, error: error.message });
  }
};

for (let index = 0; index < assetSources.length; index += 8) {
  await Promise.all(assetSources.slice(index, index + 8).map(download));
}

for (const page of pages) {
  for (const block of page.blocks) {
    if (block.type === "image") {
      block.src = assetMap[block.source] ?? block.source;
      delete block.source;
    } else {
      const $ = load(block.html, null, false);
      $("a[href^='/s/']").each((_, element) => {
        const href = $(element).attr("href");
        const localPath = assetMap[normalizeUrl(href)];
        if (localPath) $(element).attr("href", localPath);
      });
      block.html = $.html();
    }
  }
}

const logoPath = assetMap[normalizeUrl(logoUrl)];
const content = {
  source: basename(exportPath),
  logo: logoPath,
  assets: Object.values(assetMap).sort(),
  publicPaths: [...sitemapPaths].sort(),
  pages,
};

const report = {
  source: basename(exportPath),
  itemCount: pages.length,
  publicItemCount: pages.filter((page) => page.public).length,
  sitemapPathCount: sitemapPaths.size,
  assetCount: Object.keys(assetMap).length,
  failures,
};

await writeFile(new URL("content.json", outputDir), `${JSON.stringify(content, null, 2)}\n`);
await writeFile(new URL("asset-manifest.json", reportDir), `${JSON.stringify(assetMap, null, 2)}\n`);
await writeFile(new URL("report.json", reportDir), `${JSON.stringify(report, null, 2)}\n`);

console.log(JSON.stringify(report, null, 2));
