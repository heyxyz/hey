import { parseHTML } from "linkedom";
import { describe, expect, test } from "vitest";
import getFrame from "./getFrame";

describe("getFrame", () => {
  test("should return frame data when required metadata is present", () => {
    const html = `
      <html>
        <head>
          <meta name="of:version" content="1.0" />
          <meta name="of:accepts:lens" content="true" />
          <meta name="of:image" content="https://example.com/image.jpg" />
          <meta name="of:post_url" content="https://example.com/post" />
        </head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getFrame(document, "https://example.com");

    expect(result).toEqual({
      acceptsAnonymous: false,
      acceptsLens: true,
      buttons: [],
      frameUrl: "https://example.com",
      image: "https://example.com/image.jpg",
      imageAspectRatio: null,
      inputText: null,
      lensFramesVersion: "true",
      openFramesVersion: "1.0",
      postUrl: "https://example.com/post",
      state: null
    });
  });

  test("should return frame data with buttons", () => {
    const html = `
      <html>
        <head>
          <meta name="of:version" content="1.0" />
          <meta name="of:accepts:lens" content="true" />
          <meta name="of:image" content="https://example.com/image.jpg" />
          <meta name="of:post_url" content="https://example.com/post" />
          <meta name="of:button:1" content="Like" />
          <meta name="of:button:1:action" content="like" />
          <meta name="of:button:1:target" content="https://example.com/like" />
        </head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getFrame(document, "https://example.com");

    expect(result).toEqual({
      acceptsAnonymous: false,
      acceptsLens: true,
      buttons: [
        {
          action: "like",
          button: "Like",
          postUrl: "https://example.com/post",
          target: "https://example.com/like"
        }
      ],
      frameUrl: "https://example.com",
      image: "https://example.com/image.jpg",
      imageAspectRatio: null,
      inputText: null,
      lensFramesVersion: "true",
      openFramesVersion: "1.0",
      postUrl: "https://example.com/post",
      state: null
    });
  });

  test("should return null if neither accepts Lens nor anonymous", () => {
    const html = `
      <html>
        <head>
          <meta name="of:image" content="https://example.com/image.jpg" />
          <meta name="of:post_url" content="https://example.com/post" />
        </head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getFrame(document, "https://example.com");

    expect(result).toBeNull();
  });

  test("should handle anonymous frame acceptance", () => {
    const html = `
      <html>
        <head>
          <meta name="of:accepts:anonymous" content="true" />
          <meta name="of:image" content="https://example.com/image.jpg" />
          <meta name="of:post_url" content="https://example.com/post" />
        </head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getFrame(document, "https://example.com");

    expect(result).toEqual({
      acceptsAnonymous: true,
      acceptsLens: false,
      buttons: [],
      frameUrl: "https://example.com",
      image: "https://example.com/image.jpg",
      imageAspectRatio: null,
      inputText: null,
      lensFramesVersion: null,
      openFramesVersion: null,
      postUrl: "https://example.com/post",
      state: null
    });
  });

  test("should return frame with input text and state", () => {
    const html = `
      <html>
        <head>
          <meta name="of:accepts:lens" content="true" />
          <meta name="of:image" content="https://example.com/image.jpg" />
          <meta name="of:post_url" content="https://example.com/post" />
          <meta name="of:input:text" content="Enter your comment" />
          <meta name="of:state" content="ready" />
        </head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getFrame(document, "https://example.com");

    expect(result).toEqual({
      acceptsAnonymous: false,
      acceptsLens: true,
      buttons: [],
      frameUrl: "https://example.com",
      image: "https://example.com/image.jpg",
      imageAspectRatio: null,
      inputText: "Enter your comment",
      lensFramesVersion: "true",
      openFramesVersion: null,
      postUrl: "https://example.com/post",
      state: "ready"
    });
  });
});
