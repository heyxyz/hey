import type { EditorExtension } from "@helpers/prosekit/extension";
import { htmlFromMarkdown, markdownFromHTML } from "@helpers/prosekit/markdown";
import type { Editor } from "prosekit/core";
import { htmlFromNode, nodeFromHTML } from "prosekit/core";
import { describe, expect, test, vi } from "vitest";
import { getMarkdownContent, setMarkdownContent } from "./markdownContent";

// Mock dependencies
vi.mock("@helpers/prosekit/markdown", () => ({
  htmlFromMarkdown: vi.fn(),
  markdownFromHTML: vi.fn()
}));

vi.mock("prosekit/core", () => ({
  htmlFromNode: vi.fn(),
  nodeFromHTML: vi.fn()
}));

describe("getMarkdownContent", () => {
  test("should return empty string if editor is not mounted", () => {
    const mockEditor = { mounted: false } as Editor<EditorExtension>;
    const result = getMarkdownContent(mockEditor);
    expect(result).toBe("");
  });

  test("should return empty string if editor document is empty", () => {
    const mockEditor = {
      mounted: true,
      view: {
        state: { doc: { content: { size: 0 } } }
      }
    } as unknown as Editor<EditorExtension>;

    const result = getMarkdownContent(mockEditor);
    expect(result).toBeUndefined();
  });

  test("should convert editor content to markdown", () => {
    const mockHtml = "<p>Hello, World!</p>";
    const mockMarkdown = "# Hello, World!";
    (htmlFromNode as any).mockReturnValue(mockHtml);
    (markdownFromHTML as any).mockReturnValue(mockMarkdown);

    const mockEditor = {
      mounted: true,
      view: {
        state: { doc: { content: { size: 1 } } }
      }
    } as unknown as Editor<EditorExtension>;

    const result = getMarkdownContent(mockEditor);
    expect(result).toBe(mockMarkdown);
    expect(htmlFromNode).toHaveBeenCalled();
    expect(markdownFromHTML).toHaveBeenCalledWith(mockHtml);
  });
});

describe("setMarkdownContent", () => {
  test("should do nothing if editor is not mounted", () => {
    const mockEditor = { mounted: false } as Editor<EditorExtension>;

    setMarkdownContent(mockEditor, "# Markdown Content");
    expect(htmlFromMarkdown).not.toHaveBeenCalled();
  });

  test("should convert markdown to HTML and set editor content", () => {
    const mockHtml = "<p>Converted Markdown</p>";
    const mockMarkdown = "# Converted Markdown";
    const mockNode = { content: { size: 1 } };

    (htmlFromMarkdown as any).mockReturnValue(mockHtml);
    (nodeFromHTML as any).mockReturnValue(mockNode);

    const mockEditor = {
      mounted: true,
      view: {
        state: {
          schema: {},
          doc: { content: { size: 1 } },
          tr: { replaceWith: vi.fn() }
        },
        dispatch: vi.fn()
      }
    } as unknown as Editor<EditorExtension>;

    setMarkdownContent(mockEditor, mockMarkdown);

    expect(htmlFromMarkdown).toHaveBeenCalledWith(mockMarkdown);
    expect(nodeFromHTML).toHaveBeenCalledWith(mockHtml, {
      schema: mockEditor.view.state.schema
    });
    expect(mockEditor.view.dispatch).toHaveBeenCalled();
  });
});
