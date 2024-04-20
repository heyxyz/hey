import { XMLBuilder } from 'fast-xml-parser';

const builder = new XMLBuilder({
  format: true,
  ignoreAttributes: false,
  processEntities: true,
  suppressEmptyNode: true
});

interface Url {
  changefreq: string;
  lastmod: string;
  loc: string;
  priority: number;
}

export const buildUrlsetXml = (url: Url[]): string => {
  return builder.build({
    urlset: { '@_xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9', url }
  });
};

interface Sitemap {
  loc: string;
}

export const buildSitemapXml = (sitemap: Sitemap[]): string => {
  return builder.build({
    sitemapindex: {
      '@_xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
      sitemap
    }
  });
};
