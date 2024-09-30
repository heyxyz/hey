import { describe, expect, test } from "vitest";
import truncateByWords from "./truncateByWords";

describe("truncateByWords", () => {
  test("should truncate a string by words and add ellipsis", () => {
    const string = "This is a long string that needs to be truncated";
    const count = 5;
    const expectedOutput = "This is a long string…";

    expect(truncateByWords(string, count)).toEqual(expectedOutput);
  });

  test("should not change the string if it has fewer words than the specified count", () => {
    const string = "Short string";
    const count = 10;

    expect(truncateByWords(string, count)).toBe(string);
  });

  test("should return the original string if the count is equal to the number of words", () => {
    const string = "This string has five words";
    const count = 5;

    expect(truncateByWords(string, count)).toBe(string);
  });

  test("should handle an empty string", () => {
    const string = "";
    const count = 5;

    expect(truncateByWords(string, count)).toBe(string);
  });

  test("should handle a string with fewer words than the count", () => {
    const string = "This is short";
    const count = 5;

    expect(truncateByWords(string, count)).toBe(string);
  });

  test("should truncate correctly when the count is 0", () => {
    const string = "This is a string that will be truncated";
    const count = 0;
    const expectedOutput = "…";

    expect(truncateByWords(string, count)).toEqual(expectedOutput);
  });
});
