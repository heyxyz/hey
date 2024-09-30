import type { PublicationTip } from "@hey/types/hey";
import { describe, expect, test } from "vitest";
import getPublicationTipById from "./getPublicationTipById";

describe("getPublicationTipById", () => {
  test("should return the correct tip when the id matches", () => {
    const tips: PublicationTip[] = [
      { id: "0x01", count: 10, tipped: true },
      { id: "0x02", count: 20, tipped: false }
    ];
    const result = getPublicationTipById(tips, "0x01");
    expect(result).toEqual({ id: "0x01", count: 10, tipped: true });
  });

  test("should return undefined when the id does not match any tip", () => {
    const tips: PublicationTip[] = [
      { id: "0x01", count: 10, tipped: true },
      { id: "0x02", count: 20, tipped: false }
    ];
    const result = getPublicationTipById(tips, "0x03");
    expect(result).toBeUndefined();
  });

  test("should return undefined when the tips array is empty", () => {
    const tips: PublicationTip[] = [];
    const result = getPublicationTipById(tips, "0x01");
    expect(result).toBeUndefined();
  });

  test("should return the first matching tip when there are multiple tips with the same id", () => {
    const tips: PublicationTip[] = [
      { id: "0x01", count: 10, tipped: true },
      { id: "0x01", count: 15, tipped: false }
    ];
    const result = getPublicationTipById(tips, "0x01");
    expect(result).toEqual({ id: "0x01", count: 10, tipped: true }); // Returns the first match
  });

  test("should return undefined when id is an empty string", () => {
    const tips: PublicationTip[] = [
      { id: "0x01", count: 10, tipped: true },
      { id: "0x02", count: 20, tipped: false }
    ];
    const result = getPublicationTipById(tips, "");
    expect(result).toBeUndefined();
  });
});
