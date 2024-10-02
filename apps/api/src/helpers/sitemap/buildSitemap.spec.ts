import { describe, expect, test } from "vitest";
import { buildSitemapXml, buildUrlsetXml } from "./buildSitemap";

describe("buildUrlsetXml", () => {
  test("should generate correct XML for urlset with loc and lastmod", () => {
    const urlset = [
      { loc: "https://example.com/page1", lastmod: "2024-09-30" },
      { loc: "https://example.com/page2" }
    ];
    const result = buildUrlsetXml(urlset);
    const expected = `
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://example.com/page1</loc>
    <lastmod>2024-09-30</lastmod>
  </url>
  <url>
    <loc>https://example.com/page2</loc>
  </url>
</urlset>`.trim();
    expect(result.trim()).toBe(expected);
  });

  test("should generate correct XML for urlset with loc only", () => {
    const urlset = [{ loc: "https://example.com/page1" }];
    const result = buildUrlsetXml(urlset);
    const expected = `
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://example.com/page1</loc>
  </url>
</urlset>`.trim();
    expect(result.trim()).toBe(expected);
  });
});

describe("buildSitemapXml", () => {
  test("should generate correct XML for sitemapindex", () => {
    const sitemap = [
      { loc: "https://example.com/sitemap1.xml" },
      { loc: "https://example.com/sitemap2.xml" }
    ];
    const result = buildSitemapXml(sitemap);
    const expected = `
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://example.com/sitemap1.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://example.com/sitemap2.xml</loc>
  </sitemap>
</sitemapindex>`.trim();
    expect(result.trim()).toBe(expected);
  });
});
