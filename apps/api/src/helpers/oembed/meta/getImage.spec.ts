import { parseHTML } from "linkedom";
import { describe, expect, test } from "vitest";
import getImage from "./getImage";

describe("getImage", () => {
  test("should return the content of the 'og:image' meta tag", () => {
    const html = `
      <html>
        <head>
          <meta property="og:image" content="https://example.com/image.jpg" />
        </head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getImage(document);

    expect(result).toBe("https://example.com/image.jpg");
  });

  test("should return the content of the 'twitter:image' meta tag if 'og:image' is not present", () => {
    const html = `
      <html>
        <head>
          <meta name="twitter:image" content="https://twitter.com/image.jpg" />
        </head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getImage(document);

    expect(result).toBe("https://twitter.com/image.jpg");
  });

  test("should return the content of 'twitter:image:src' if both 'og:image' and 'twitter:image' are not present", () => {
    const html = `
      <html>
        <head>
          <meta name="twitter:image:src" content="https://twitter.com/image-src.jpg" />
        </head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getImage(document);

    expect(result).toBe("https://twitter.com/image-src.jpg");
  });

  test("should return the content of 'property=twitter:image' if 'name' attributes are not present", () => {
    const html = `
      <html>
        <head>
          <meta property="twitter:image" content="https://twitter.com/image.jpg" />
        </head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getImage(document);

    expect(result).toBe("https://twitter.com/image.jpg");
  });

  test("should return null if neither 'og:image' nor 'twitter:image' meta tags are present", () => {
    const html = `
      <html>
        <head></head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getImage(document);

    expect(result).toBeNull();
  });

  test("should return null if the 'content' attribute is missing in 'og:image'", () => {
    const html = `
      <html>
        <head>
          <meta property="og:image" />
        </head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getImage(document);

    expect(result).toBeNull();
  });
});
