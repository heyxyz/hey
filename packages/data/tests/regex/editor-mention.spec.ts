import { describe, expect, test } from "vitest";
import { regexLookbehindAvailable } from "../../can-use-regex-lookbehind";
import { EditorRegex } from "../../regex";

describe("EditorRegex.mention", () => {
  test("should match valid mentions when lookbehind is available", () => {
    const mentionRegex = EditorRegex.mention;
    const testString = "@username";

    // Simulate lookbehind availability
    if (regexLookbehindAvailable) {
      expect(testString.match(mentionRegex)).toEqual(["@username"]);
    } else {
      expect(testString.match(mentionRegex)).toBeNull();
    }
  });

  test("should match valid mentions without namespaces", () => {
    const mentionRegex = EditorRegex.mention;
    const testString = "@john_doe123";

    const result = testString.match(mentionRegex);
    expect(result).toEqual(["@john_doe123"]);
  });

  test("should not match invalid mentions with special characters", () => {
    const mentionRegex = EditorRegex.mention;
    const testString = "@invalid!mention";

    const result = testString.match(mentionRegex);
    expect(result).toBeNull();
  });

  test("should match valid mention after whitespace", () => {
    const mentionRegex = EditorRegex.mention;
    const testString = "Hello @username";

    const result = testString.match(mentionRegex);
    expect(result).toEqual(["@username"]);
  });

  test("should not match mention in the middle of a word without preceding whitespace", () => {
    const mentionRegex = EditorRegex.mention;
    const testString = "thisis@notamatch";

    const result = testString.match(mentionRegex);
    expect(result).toBeNull();
  });

  test("should handle mention at the end of a string", () => {
    const mentionRegex = EditorRegex.mention;
    const testString = "This is a test @john";

    const result = testString.match(mentionRegex);
    expect(result).toEqual(["@john"]);
  });

  test("should handle no mention", () => {
    const mentionRegex = EditorRegex.mention;
    const testString = "This is a test";

    const result = testString.match(mentionRegex);
    expect(result).toBeNull();
  });
});
