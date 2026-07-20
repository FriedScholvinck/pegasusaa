const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export const withBase = (path: string) => {
  if (/^(?:[a-z]+:|#)/i.test(path)) {
    return path;
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}` || "/";
};

export const htmlWithBase = (html: string) =>
  html.replace(
    /\b(href|src)=(["'])\/(?!\/)/g,
    (_, attribute: string, quote: string) => `${attribute}=${quote}${base}/`,
  );
