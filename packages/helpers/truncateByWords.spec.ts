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
});
