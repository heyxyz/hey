import { parseHTML } from "linkedom";
import { describe, expect, test } from "vitest";
import getEmbedUrl from "./getEmbedUrl";

describe("getEmbedUrl", () => {
  test("should return the content of the 'og:video:url' meta tag", () => {
    const html = `
      <html>
        <head>
          <meta property="og:video:url" content="https://example.com/video.mp4" />
        </head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getEmbedUrl(document);

    expect(result).toBe("https://example.com/video.mp4");
  });

  test("should return the content of the 'og:video:secure_url' meta tag", () => {
    const html = `
      <html>
        <head>
          <meta property="og:video:secure_url" content="https://secure.example.com/video.mp4" />
        </head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getEmbedUrl(document);

    expect(result).toBe("https://secure.example.com/video.mp4");
  });

  test("should return the content of the 'twitter:player' meta tag if 'og:video' is not present", () => {
    const html = `
      <html>
        <head>
          <meta property="twitter:player" content="https://twitter.com/player/video.mp4" />
        </head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getEmbedUrl(document);

    expect(result).toBe("https://twitter.com/player/video.mp4");
  });

  test("should return the content of 'name=twitter:player' if it's present", () => {
    const html = `
      <html>
        <head>
          <meta name="twitter:player" content="https://twitter.com/player/video.mp4" />
        </head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getEmbedUrl(document);

    expect(result).toBe("https://twitter.com/player/video.mp4");
  });

  test("should return null if neither 'og:video' nor 'twitter:player' is present", () => {
    const html = `
      <html>
        <head></head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getEmbedUrl(document);

    expect(result).toBeNull();
  });

  test("should return null if the 'content' attribute is missing in 'og:video:url'", () => {
    const html = `
      <html>
        <head>
          <meta property="og:video:url" />
        </head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getEmbedUrl(document);

    expect(result).toBeNull();
  });
});
