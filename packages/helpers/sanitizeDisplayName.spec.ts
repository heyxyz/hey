import { describe, expect, test } from "vitest";
import sanitizeDisplayName from "./sanitizeDisplayName";

describe("sanitizeDisplayName", () => {
  test("should remove restricted symbols from profile name", () => {
    const name = "John Doe ✅";
    const expectedName = "John Doe";
    expect(sanitizeDisplayName(name)).toEqual(expectedName);
  });

  test("should remove multiple restricted symbols from profile name", () => {
    const name = "Jane ✔️ Doe ☑️";
    const expectedName = "Jane Doe";
    expect(sanitizeDisplayName(name)).toEqual(expectedName);
  });

  test("should return null when input is null", () => {
    expect(sanitizeDisplayName(null)).toBeNull();
  });

  test("should return null when input is undefined", () => {
    expect(sanitizeDisplayName(undefined)).toBeNull();
  });

  test("should return the same name if no restricted symbols are present", () => {
    const name = "John Doe";
    expect(sanitizeDisplayName(name)).toBe(name);
  });

  test("should trim spaces after removing restricted symbols", () => {
    const name = "John Doe ☑️ ";
    const expectedName = "John Doe";
    expect(sanitizeDisplayName(name)).toEqual(expectedName);
  });

  test("should handle empty string", () => {
    expect(sanitizeDisplayName("")).toBeNull();
  });

  test("should handle names with only restricted symbols", () => {
    const name = "☑️✅";
    const expectedName = "";
    expect(sanitizeDisplayName(name)).toBe(expectedName);
  });

  test("should not remove valid characters or symbols not in the restricted list", () => {
    const name = "John_Doe!";
    expect(sanitizeDisplayName(name)).toBe("John_Doe!");
  });

  test("should handle names with mixed valid and restricted characters", () => {
    const name = "User☑️Name✅";
    const expectedName = "User Name";
    expect(sanitizeDisplayName(name)).toBe(expectedName);
  });
});
