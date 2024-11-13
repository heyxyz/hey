import type { PostTip } from "@hey/types/hey";
import { describe, expect, test } from "vitest";
import getPostTipById from "./getPostTipById";

describe("getPostTipById", () => {
  test("should return the correct tip when the id matches", () => {
    const tips: PostTip[] = [
      { id: "0x01", count: 10, tipped: true },
      { id: "0x02", count: 20, tipped: false }
    ];
    const result = getPostTipById(tips, "0x01");
    expect(result).toEqual({ id: "0x01", count: 10, tipped: true });
  });

  test("should return undefined when the id does not match any tip", () => {
    const tips: PostTip[] = [
      { id: "0x01", count: 10, tipped: true },
      { id: "0x02", count: 20, tipped: false }
    ];
    const result = getPostTipById(tips, "0x03");
    expect(result).toBeUndefined();
  });

  test("should return undefined when the tips array is empty", () => {
    const tips: PostTip[] = [];
    const result = getPostTipById(tips, "0x01");
    expect(result).toBeUndefined();
  });

  test("should return the first matching tip when there are multiple tips with the same id", () => {
    const tips: PostTip[] = [
      { id: "0x01", count: 10, tipped: true },
      { id: "0x01", count: 15, tipped: false }
    ];
    const result = getPostTipById(tips, "0x01");
    expect(result).toEqual({ id: "0x01", count: 10, tipped: true }); // Returns the first match
  });

  test("should return undefined when id is an empty string", () => {
    const tips: PostTip[] = [
      { id: "0x01", count: 10, tipped: true },
      { id: "0x02", count: 20, tipped: false }
    ];
    const result = getPostTipById(tips, "");
    expect(result).toBeUndefined();
  });
});
