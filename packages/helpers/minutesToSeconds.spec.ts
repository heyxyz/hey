import { describe, expect, test } from "vitest";
import minutesToSeconds from "./minutesToSeconds";

describe("minutesToSeconds", () => {
  test("should convert minutes to seconds", () => {
    expect(minutesToSeconds(1)).toBe(60);
    expect(minutesToSeconds(10)).toBe(600);
    expect(minutesToSeconds(0)).toBe(0);
  });

  test("should handle negative numbers", () => {
    expect(minutesToSeconds(-1)).toBe(-60);
    expect(minutesToSeconds(-10)).toBe(-600);
  });

  test("should handle decimal values", () => {
    expect(minutesToSeconds(1.5)).toBe(90);
    expect(minutesToSeconds(2.75)).toBe(165);
  });

  test("should handle large values", () => {
    expect(minutesToSeconds(1000)).toBe(60000);
  });
});
