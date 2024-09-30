import { describe, expect, test, vi } from "vitest";
import randomNumber from "./randomNumber";

describe("randomNumber", () => {
  test("should generate a random number within the given range", () => {
    const min = 1;
    const max = 10;
    const result = randomNumber(min, max);
    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThan(max);
  });

  test("should generate the same number when min and max are the same", () => {
    const min = 5;
    const max = 5;
    const result = randomNumber(min, max);
    expect(result).toBe(min);
  });

  test("should generate a number in the correct range when negative numbers are used", () => {
    const min = -10;
    const max = 0;
    const result = randomNumber(min, max);
    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThan(max);
  });

  test("should always return the correct number for mocked Math.random", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const result = randomNumber(1, 10);
    expect(result).toBe(5);
    vi.restoreAllMocks();
  });
});
