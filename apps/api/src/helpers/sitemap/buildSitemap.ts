import { XMLBuilder } from "fast-xml-parser";

const builder = new XMLBuilder({
  format: true,
  ignoreAttributes: false,
  processEntities: true,
  suppressEmptyNode: true
});

interface Urlset {
  lastmod?: string;
  loc: string;
}

export const buildUrlsetXml = (url: Urlset[]): string => {
  return builder.build({
    urlset: {
      "@_xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
      "@_xmlns:image": "http://www.google.com/schemas/sitemap-image/1.1",
      "@_xmlns:mobile": "http://www.google.com/schemas/sitemap-mobile/1.0",
      "@_xmlns:news": "http://www.google.com/schemas/sitemap-news/0.9",
      "@_xmlns:video": "http://www.google.com/schemas/sitemap-video/1.1",
      "@_xmlns:xhtml": "http://www.w3.org/1999/xhtml",
      url
    }
  });
};

interface Sitemap {
  loc: string;
}

export const buildSitemapXml = (sitemap: Sitemap[]): string => {
  return builder.build({
    sitemapindex: {
      "@_xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
      sitemap
    }
  });
};
