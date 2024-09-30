import { describe, expect, test } from "vitest";
import humanize from "./humanize";

describe("humanize", () => {
  test("should return the number as a string without commas for numbers less than 1000", () => {
    expect(humanize(0)).toEqual("0");
    expect(humanize(10)).toEqual("10");
    expect(humanize(100)).toEqual("100");
  });

  test("should return comma-separated numbers for values in the thousands", () => {
    expect(humanize(1000)).toEqual("1,000");
    expect(humanize(10000)).toEqual("10,000");
    expect(humanize(100000)).toEqual("100,000");
  });

  test("should return comma-separated numbers for values in the millions and beyond", () => {
    expect(humanize(1000000)).toEqual("1,000,000");
    expect(humanize(123456789)).toEqual("123,456,789");
  });

  test("should return an empty string for invalid inputs", () => {
    expect(humanize(Number.NaN)).toEqual("");
    expect(humanize(null as any)).toEqual("");
    expect(humanize(undefined as any)).toEqual("");
  });
});
