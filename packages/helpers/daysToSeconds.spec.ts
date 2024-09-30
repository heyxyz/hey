import { describe, expect, test } from "vitest";
import daysToSeconds from "./daysToSeconds";

describe("daysToSeconds", () => {
  test("should convert positive integer days to seconds", () => {
    const result = daysToSeconds(1);
    expect(result).toBe(86400); // 1 day = 86400 seconds
  });

  test("should handle zero days", () => {
    const result = daysToSeconds(0);
    expect(result).toBe(0);
  });

  test("should convert fractional days to seconds", () => {
    const result = daysToSeconds(0.5);
    expect(result).toBe(43200); // 0.5 day = 43200 seconds
  });

  test("should handle negative days", () => {
    const result = daysToSeconds(-1);
    expect(result).toBe(-86400); // -1 day = -86400 seconds
  });

  test("should handle large number of days", () => {
    const result = daysToSeconds(1000000);
    expect(result).toBe(86400000000); // 1,000,000 days in seconds
  });

  test("should handle very small fractional days", () => {
    const result = daysToSeconds(0.000001);
    expect(result).toBeCloseTo(0.0864, 4); // Approximately 0.0864 seconds
  });

  test("should handle NaN input", () => {
    const result = daysToSeconds(Number.NaN);
    expect(result).toBeNaN();
  });

  test("should handle Infinity input", () => {
    const result = daysToSeconds(Number.POSITIVE_INFINITY);
    expect(result).toBe(Number.POSITIVE_INFINITY);
  });

  test("should handle -Infinity input", () => {
    const result = daysToSeconds(Number.NEGATIVE_INFINITY);
    expect(result).toBe(Number.NEGATIVE_INFINITY);
  });

  test("should handle extremely small negative fractional days", () => {
    const result = daysToSeconds(-0.000001);
    expect(result).toBeCloseTo(-0.0864, 4); // Approximately -0.0864 seconds
  });

  test("should handle maximum safe integer in JavaScript", () => {
    const result = daysToSeconds(Number.MAX_SAFE_INTEGER);
    expect(result).toBe(Number.MAX_SAFE_INTEGER * 86400);
  });

  test("should handle minimum safe integer in JavaScript", () => {
    const result = daysToSeconds(Number.MIN_SAFE_INTEGER);
    expect(result).toBe(Number.MIN_SAFE_INTEGER * 86400);
  });

  test("should handle positive zero", () => {
    const result = daysToSeconds(+0);
    expect(result).toBe(0);
  });

  test("should handle negative zero", () => {
    const result = daysToSeconds(-0);
    expect(Object.is(result, -0)).toBe(true);
  });

  test("should handle input as string that can be converted to number", () => {
    // TypeScript will not allow string inputs, so we simulate this by casting
    const result = daysToSeconds(Number("2"));
    expect(result).toBe(172800);
  });

  test("should handle input as string that cannot be converted to number", () => {
    const result = daysToSeconds(Number("abc"));
    expect(result).toBeNaN();
  });
});
