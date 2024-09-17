import { describe, expect, test } from "vitest";

import sanitizeDisplayName from "./sanitizeDisplayName";

describe("sanitizeDisplayName", () => {
  test("should remove restricted symbols from profile name", () => {
    const name = "John Doe ✅";
    const expectedName = "John Doe";

    expect(sanitizeDisplayName(name)).toEqual(expectedName);
  });

  test("should handle null or undefined input correctly", () => {
    expect(sanitizeDisplayName(null)).toBeNull();
    expect(sanitizeDisplayName(null)).toBeNull();
  });

  test("should return the same name if no restricted symbols are present", () => {
    const name = "John Doe";
    expect(sanitizeDisplayName(name)).toBe(name);
  });
});
