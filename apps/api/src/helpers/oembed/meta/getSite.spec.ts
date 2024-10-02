import { parseHTML } from "linkedom";
import { describe, expect, test } from "vitest";
import getSite from "./getSite";

describe("getSite", () => {
  test("should return the content of the 'og:site_name' meta tag", () => {
    const html = `
      <html>
        <head>
          <meta property="og:site_name" content="Example Site" />
        </head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getSite(document);

    expect(result).toBe("Example Site");
  });

  test("should return the content of the 'twitter:site' meta tag if 'og:site_name' is not present", () => {
    const html = `
      <html>
        <head>
          <meta name="twitter:site" content="@example" />
        </head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getSite(document);

    expect(result).toBe("@example");
  });

  test("should return the content of 'property=og:site_name' if 'name=og:site_name' is not present", () => {
    const html = `
      <html>
        <head>
          <meta property="og:site_name" content="Another Example Site" />
        </head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getSite(document);

    expect(result).toBe("Another Example Site");
  });

  test("should return the content of 'property=twitter:site' if 'name=twitter:site' is not present", () => {
    const html = `
      <html>
        <head>
          <meta property="twitter:site" content="@anotherexample" />
        </head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getSite(document);

    expect(result).toBe("@anotherexample");
  });

  test("should return null if neither 'og:site_name' nor 'twitter:site' meta tags are present", () => {
    const html = `
      <html>
        <head></head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getSite(document);

    expect(result).toBeNull();
  });

  test("should return null if the 'content' attribute is missing in 'og:site_name'", () => {
    const html = `
      <html>
        <head>
          <meta property="og:site_name" />
        </head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getSite(document);

    expect(result).toBeNull();
  });
});
