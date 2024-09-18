import { describe, expect, test } from "vitest";
import { htmlFromMarkdown, markdownFromHTML } from "./markdown";

describe("markdownFromHTML", () => {
  test("should convert HTML to markdown", () => {
    const html = "<p>Text <strong>Bold</strong> <em>italic</em></p>";
    const markdown = markdownFromHTML(html);
    expect(markdown).toMatchInlineSnapshot(`
      "Text **Bold** *italic*
      "
    `);
  });

  test("should not escape mention handles with _", () => {
    const html =
      "<p>A normal handle: <span>@lens/foo</span></p>" +
      "<p>A handle with underscore: <span>@lens/foo_bar</span></p>";
    const markdown = markdownFromHTML(html);
    expect(markdown).toContain("@lens/foo");
    expect(markdown).toContain("@lens/foo_bar");
    expect(markdown).toMatchInlineSnapshot(`
      "A normal handle: @lens/foo

      A handle with underscore: @lens/foo_bar
      "
    `);
  });
});

describe("htmlFromMarkdown", () => {
  test("should convert markdown to HTML", () => {
    const markdown = "Text **Bold** _italic_";
    const html = htmlFromMarkdown(markdown);
    expect(html).toMatchInlineSnapshot(`
      "<p>Text <strong>Bold</strong> <em>italic</em></p>
      "
    `);
  });

  test("should not escape mention handles with _", () => {
    const markdown = [
      "A normal handle: @lens/foo",
      "A handle with underscore: @lens/foo_bar"
    ].join("\n\n");
    const html = htmlFromMarkdown(markdown);
    expect(html).toMatchInlineSnapshot(`
      "<p>A normal handle: @lens/foo</p>
      <p>A handle with underscore: @lens/foo_bar</p>
      "
    `);
  });
});
