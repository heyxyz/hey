import { parseHTML } from "linkedom";
import { describe, expect, test } from "vitest";
import getTitle from "./getTitle";

describe("getTitle", () => {
  test("should return the content of the 'og:title' meta tag", () => {
    const html = `
      <html>
        <head>
          <meta property="og:title" content="Example OG Title" />
        </head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getTitle(document);

    expect(result).toBe("Example OG Title");
  });

  test("should return the content of the 'twitter:title' meta tag if 'og:title' is not present", () => {
    const html = `
      <html>
        <head>
          <meta name="twitter:title" content="Example Twitter Title" />
        </head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getTitle(document);

    expect(result).toBe("Example Twitter Title");
  });

  test("should return the content of 'property=og:title' if 'name=og:title' is not present", () => {
    const html = `
      <html>
        <head>
          <meta property="og:title" content="OG Property Title" />
        </head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getTitle(document);

    expect(result).toBe("OG Property Title");
  });

  test("should return the content of 'property=twitter:title' if 'name=twitter:title' is not present", () => {
    const html = `
      <html>
        <head>
          <meta property="twitter:title" content="Twitter Property Title" />
        </head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getTitle(document);

    expect(result).toBe("Twitter Property Title");
  });

  test("should return null if neither 'og:title' nor 'twitter:title' meta tags are present", () => {
    const html = `
      <html>
        <head></head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getTitle(document);

    expect(result).toBeNull();
  });

  test("should return null if the 'content' attribute is missing in 'og:title'", () => {
    const html = `
      <html>
        <head>
          <meta property="og:title" />
        </head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getTitle(document);

    expect(result).toBeNull();
  });
});
