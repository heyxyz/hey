import { describe, expect, test } from "vitest";
import { EditorRegex } from "../regex";
import regexLookbehindAvailable from "../utils/regexLookbehindAvailable";

describe("EditorRegex.club", () => {
  test("should match valid club mentions when lookbehind is available", () => {
    const clubRegex = EditorRegex.club;
    const testString = "/bonsai";

    if (regexLookbehindAvailable) {
      const result = testString.match(clubRegex);
      expect(result).toEqual(["/bonsai"]);
    } else {
      const result = testString.match(clubRegex);
      expect(result).toBeNull();
    }
  });

  test("should match valid club names after whitespace", () => {
    const clubRegex = EditorRegex.club;
    const testString = "Check out /bonsai";

    const result = testString.match(clubRegex);
    expect(result).toEqual(["/bonsai"]);
  });

  test("should not match invalid club names with special characters", () => {
    const clubRegex = EditorRegex.club;
    const testString = "/invalid!club";

    const result = testString.match(clubRegex);
    expect(result).toBeNull();
  });

  test("should match club mention at the end of a string", () => {
    const clubRegex = EditorRegex.club;
    const testString = "Check out the club /bonsai";

    const result = testString.match(clubRegex);
    expect(result).toEqual(["/bonsai"]);
  });

  test("should not match partial club names without preceding slash", () => {
    const clubRegex = EditorRegex.club;
    const testString = "This is not a club bonsai";

    const result = testString.match(clubRegex);
    expect(result).toBeNull();
  });

  test("should not match club mentions in the middle of a word", () => {
    const clubRegex = EditorRegex.club;
    const testString = "thisisnot/aclub";

    const result = testString.match(clubRegex);
    expect(result).toBeNull();
  });

  test("should handle no club mention", () => {
    const clubRegex = EditorRegex.club;
    const testString = "This is just a test string";

    const result = testString.match(clubRegex);
    expect(result).toBeNull();
  });
});
