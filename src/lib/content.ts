import source from "../data/content.json";

export type ContentBlock =
  | { type: "image"; src: string; alt: string }
  | { type: "html"; html: string };

export type ContentPage = {
  path: string;
  title: string;
  type: "page" | "post";
  status: string;
  publishedAt: string;
  author: string;
  public: boolean;
  blocks: ContentBlock[];
};

export const content = source as {
  logo: string;
  assets: string[];
  publicPaths: string[];
  pages: ContentPage[];
};

export const getPage = (path: string) =>
  content.pages.find((page) => page.path === path);

export const getImage = (page: ContentPage | undefined, match?: string) =>
  page?.blocks.find(
    (block): block is Extract<ContentBlock, { type: "image" }> =>
      block.type === "image" && (!match || block.src.toLowerCase().includes(match.toLowerCase())),
  );

export const findAsset = (match: string) =>
  content.assets.find((asset) => asset.toLowerCase().includes(match.toLowerCase()));

const decodeEntities = (value: string) =>
  value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "’")
    .replace(/&ldquo;|&rdquo;/g, '"');

export const textFromHtml = (html: string) =>
  decodeEntities(html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());

export const excerptFor = (page: ContentPage, length = 190) => {
  const text = page.blocks
    .filter((block): block is Extract<ContentBlock, { type: "html" }> => block.type === "html")
    .map((block) => textFromHtml(block.html))
    .join(" ");
  return text.length > length ? `${text.slice(0, length).trim()}…` : text;
};

export const articles = content.pages
  .filter(
    (page) =>
      page.type === "post" &&
      page.status === "publish" &&
      page.path.startsWith("/news-articles/") &&
      page.path !==
        "/news-articles/2023/2/9/announcement-expansion-of-pegasus-aviation-advisors",
  )
  .sort(
    (first, second) =>
      new Date(second.publishedAt).getTime() - new Date(first.publishedAt).getTime(),
  );

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
