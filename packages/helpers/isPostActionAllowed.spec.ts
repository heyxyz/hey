import { PostActionType } from "@hey/indexer";
import { describe, expect, test } from "vitest";
import isOpenActionAllowed from "./isPostActionAllowed";

describe("isOpenActionAllowed", () => {
  test("should return false if postActions is undefined", () => {
    const result = isOpenActionAllowed(undefined);
    expect(result).toBe(false);
  });

  test("should return false if postActions is null", () => {
    const result = isOpenActionAllowed(null);
    expect(result).toBe(false);
  });

  test("should return false if postActions is an empty array", () => {
    const result = isOpenActionAllowed([]);
    expect(result).toBe(false);
  });

  test("should return false if no postActions are allowed", () => {
    const postActions = [
      { type: "SomeOtherActionModule" },
      { type: "AnotherActionModule" }
    ];
    const result = isOpenActionAllowed(postActions as any);
    expect(result).toBe(false);
  });

  test("should return true if some postActions are allowed and some are not", () => {
    const postActions = [
      { type: "SomeOtherActionModule" },
      { type: PostActionType.SimpleCollectAction }
    ];
    const result = isOpenActionAllowed(postActions as any);
    expect(result).toBe(true);
  });

  test("should return false if the postAction type is undefined", () => {
    const postActions = [{ type: undefined }];
    const result = isOpenActionAllowed(postActions as any);
    expect(result).toBe(false);
  });
});
