import { describe, expect, test } from "vitest";

import getAppName from "./getAppName";

describe("getAppName", () => {
  test("should capitalize first character and replace hyphen with a space in a string", () => {
    const inputString = "my-app";
    const expectedOutput = "My app";
    expect(getAppName(inputString)).toBe(expectedOutput);
  });

  test("should handle empty string as input", () => {
    const inputString = "";
    const expectedOutput = "";
    expect(getAppName(inputString)).toBe(expectedOutput);
  });

  test("should handle single character as input", () => {
    const inputString = "a";
    const expectedOutput = "A";
    expect(getAppName(inputString)).toBe(expectedOutput);
  });

  test("should handle input with no hyphens and only a single character", () => {
    const inputString = "word";
    const expectedOutput = "Word";
    expect(getAppName(inputString)).toBe(expectedOutput);
  });

  test("should handle input with multiple hyphens", () => {
    const inputString = "one-two-three-four";
    const expectedOutput = "One two three four";
    expect(getAppName(inputString)).toBe(expectedOutput);
  });
});
