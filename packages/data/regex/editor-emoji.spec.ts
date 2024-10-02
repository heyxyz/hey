import { describe, expect, test } from "vitest";
import { EditorRegex } from "../regex";

describe("EditorRegex.emoji", () => {
  test("should match a valid emoji at the end of the line", () => {
    const text = "Hello world :smile";
    const result = text.match(EditorRegex.emoji);
    expect(result).toEqual([":smile"]);
  });

  test("should not match an invalid emoji format", () => {
    const text = "Invalid :emoji123 format";
    const result = text.match(EditorRegex.emoji);
    expect(result).toBeNull();
  });

  test("should not match emoji in the middle of a word", () => {
    const text = "This:emoji is in the middle";
    const result = text.match(EditorRegex.emoji);
    expect(result).toBeNull();
  });

  test("should match an emoji with underscores", () => {
    const text = "Hello :happy_face";
    const result = text.match(EditorRegex.emoji);
    expect(result).toEqual([":happy_face"]);
  });

  test("should not match without the colon", () => {
    const text = "No colon happy_face";
    const result = text.match(EditorRegex.emoji);
    expect(result).toBeNull();
  });
});
