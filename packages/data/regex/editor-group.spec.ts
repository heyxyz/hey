import { describe, expect, test } from "vitest";
import { EditorRegex } from "../regex";
import regexLookbehindAvailable from "../utils/regexLookbehindAvailable";

describe("EditorRegex.club", () => {
  test("should match valid group mentions when lookbehind is available", () => {
    const groupRegex = EditorRegex.group;
    const testString = "/bonsai";

    if (regexLookbehindAvailable) {
      const result = testString.match(groupRegex);
      expect(result).toEqual(["/bonsai"]);
    } else {
      const result = testString.match(groupRegex);
      expect(result).toBeNull();
    }
  });

  test("should match valid group names after whitespace", () => {
    const groupRegex = EditorRegex.group;
    const testString = "Check out /bonsai";

    const result = testString.match(groupRegex);
    expect(result).toEqual(["/bonsai"]);
  });

  test("should not match invalid group names with special characters", () => {
    const groupRegex = EditorRegex.group;
    const testString = "/invalid!group";

    const result = testString.match(groupRegex);
    expect(result).toBeNull();
  });

  test("should match club mention at the end of a string", () => {
    const groupRegex = EditorRegex.group;
    const testString = "Check out the group /bonsai";

    const result = testString.match(groupRegex);
    expect(result).toEqual(["/bonsai"]);
  });

  test("should not match partial club names without preceding slash", () => {
    const groupRegex = EditorRegex.group;
    const testString = "This is not a group bonsai";

    const result = testString.match(groupRegex);
    expect(result).toBeNull();
  });

  test("should not match club mentions in the middle of a word", () => {
    const groupRegex = EditorRegex.group;
    const testString = "thisisnot/aclub";

    const result = testString.match(groupRegex);
    expect(result).toBeNull();
  });

  test("should handle no group mention", () => {
    const groupRegex = EditorRegex.group;
    const testString = "This is just a test string";

    const result = testString.match(groupRegex);
    expect(result).toBeNull();
  });
});
