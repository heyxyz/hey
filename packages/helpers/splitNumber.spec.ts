import { describe, expect, test } from "vitest";

import splitNumber from "./splitNumber";

describe("splitNumber", () => {
  test("should split number equally", () => {
    expect(splitNumber(10, 2)).toEqual([5, 5]);
  });

  test("should split numbers evenly and get remainder", () => {
    expect(splitNumber(7, 3)).toEqual([3, 2, 2]);
  });

  test("should default to one part if parts is not specified", () => {
    expect(splitNumber(8)).toEqual([8]);
  });

  test("should default to 1 if num and parts are not specified", () => {
    expect(splitNumber()).toEqual([1]);
  });

  test("should have at least one item in all parts", () => {
    expect(splitNumber(4, 5)).toEqual([1, 1, 1, 1, 0]);
  });

  test("should return array should always have the length of parts even when there is no exact split", () => {
    expect(splitNumber(11, 3)).toEqual([4, 4, 3]);
  });

  test("should return array should be sorted in descending order according to input parameters ", () => {
    expect(splitNumber(14, 4)).toEqual([4, 4, 3, 3]);
  });
});
