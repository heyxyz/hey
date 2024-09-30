import { OpenActionModuleType } from "@hey/lens";
import { describe, expect, test } from "vitest";
import isOpenActionAllowed from "./isOpenActionAllowed";

describe("isOpenActionAllowed", () => {
  test("should return false if openActions is undefined", () => {
    const result = isOpenActionAllowed(undefined);
    expect(result).toBe(false);
  });

  test("should return false if openActions is null", () => {
    const result = isOpenActionAllowed(null);
    expect(result).toBe(false);
  });

  test("should return false if openActions is an empty array", () => {
    const result = isOpenActionAllowed([]);
    expect(result).toBe(false);
  });

  test("should return false if no openActions are allowed", () => {
    const openActions = [
      { type: "SomeOtherActionModule" },
      { type: "AnotherActionModule" }
    ];
    const result = isOpenActionAllowed(openActions as any);
    expect(result).toBe(false);
  });

  test("should return true if some openActions are allowed and some are not", () => {
    const openActions = [
      { type: "SomeOtherActionModule" },
      { type: OpenActionModuleType.SimpleCollectOpenActionModule }
    ];
    const result = isOpenActionAllowed(openActions as any);
    expect(result).toBe(true);
  });

  test("should return false if the openAction type is undefined", () => {
    const openActions = [{ type: undefined }];
    const result = isOpenActionAllowed(openActions as any);
    expect(result).toBe(false);
  });
});
