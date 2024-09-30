import { describe, expect, test } from "vitest";
import splitNumber from "./splitNumber";

describe("splitNumber", () => {
  test("should split number equally when divisible", () => {
    expect(splitNumber(10, 2)).toEqual([5, 5]);
  });

  test("should split number and distribute remainder correctly", () => {
    expect(splitNumber(7, 3)).toEqual([3, 2, 2]);
    expect(splitNumber(11, 3)).toEqual([4, 4, 3]);
  });

  test("should return one part if parts is not specified", () => {
    expect(splitNumber(8)).toEqual([8]);
  });

  test("should default to 1 if num and parts are not specified", () => {
    expect(splitNumber()).toEqual([1]);
  });

  test("should distribute remainder correctly even when parts are more than num", () => {
    expect(splitNumber(4, 5)).toEqual([1, 1, 1, 1, 0]);
  });

  test("should return array with correct length even when split is not exact", () => {
    expect(splitNumber(11, 3)).toEqual([4, 4, 3]);
  });

  test("should return array in descending order when split and remainder is distributed", () => {
    expect(splitNumber(14, 4)).toEqual([4, 4, 3, 3]);
  });

  test("should return all zeroes if number is 0", () => {
    expect(splitNumber(0, 5)).toEqual([0, 0, 0, 0, 0]);
  });

  test("should handle case where number is smaller than parts", () => {
    expect(splitNumber(2, 5)).toEqual([1, 1, 0, 0, 0]);
  });
});
