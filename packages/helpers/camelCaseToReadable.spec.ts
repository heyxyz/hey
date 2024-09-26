import { describe, expect, test } from "vitest";
import camelCaseToReadable from "./camelCaseToReadable";

describe("camelCaseToReadable", () => {
  test("should convert camelCase to Camel Case", () => {
    const result = camelCaseToReadable("camelCase");
    expect(result).toBe("Camel Case");
  });

  test("should convert camel to Camel", () => {
    const result = camelCaseToReadable("camel");
    expect(result).toBe("Camel");
  });

  test("should handle empty string as input", () => {
    const result = camelCaseToReadable("");
    expect(result).toBe("");
  });
});
