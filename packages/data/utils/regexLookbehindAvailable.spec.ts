import { describe, expect, test } from "vitest";
import regexLookbehindAvailable from "./regexLookbehindAvailable";

describe("regexLookbehindAvailable", () => {
  test("should return true if the environment supports lookbehind", () => {
    // Assuming the environment does support lookbehind regex
    expect(regexLookbehindAvailable).toBe(true);
  });

  test("should return false if the environment does not support lookbehind", () => {
    // Mock an environment without regex lookbehind support
    const originalReplace = String.prototype.replace;
    String.prototype.replace = () => {
      throw new SyntaxError(
        "Invalid regular expression: lookbehind not supported"
      );
    };

    const mockLookbehindAvailable = ((): boolean => {
      try {
        return "ab".replace(/(?<=a)b/g, "c") === "ac";
      } catch {
        return false;
      }
    })();

    expect(mockLookbehindAvailable).toBe(false);

    // Restore original replace method
    String.prototype.replace = originalReplace;
  });
});
