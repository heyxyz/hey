import { parseHTML } from "linkedom";
import { describe, expect, test } from "vitest";
import getDescription from "./getDescription";

describe("getDescription", () => {
  test("should return the content of the 'og:description' meta tag", () => {
    const html = `
      <html>
        <head>
          <meta property="og:description" content="This is the OG description" />
        </head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getDescription(document);

    expect(result).toBe("This is the OG description");
  });

  test("should return the content of the 'twitter:description' meta tag if 'og:description' is not present", () => {
    const html = `
      <html>
        <head>
          <meta property="twitter:description" content="This is the Twitter description" />
        </head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getDescription(document);

    expect(result).toBe("This is the Twitter description");
  });

  test("should return the content of 'name=og:description' if it's present", () => {
    const html = `
      <html>
        <head>
          <meta name="og:description" content="This is the OG description with name attribute" />
        </head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getDescription(document);

    expect(result).toBe("This is the OG description with name attribute");
  });

  test("should return null if neither 'og:description' nor 'twitter:description' is present", () => {
    const html = `
      <html>
        <head></head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getDescription(document);

    expect(result).toBeNull();
  });

  test("should return null if the 'content' attribute is missing in 'og:description'", () => {
    const html = `
      <html>
        <head>
          <meta property="og:description" />
        </head>
      </html>
    `;
    const { document } = parseHTML(html);
    const result = getDescription(document);

    expect(result).toBeNull();
  });
});
