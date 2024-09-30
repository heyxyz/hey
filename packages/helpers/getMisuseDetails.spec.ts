import { misused } from "@hey/data/misused";
import { describe, expect, test } from "vitest";
import getMisuseDetails from "./getMisuseDetails";

describe("getMisuseDetails", () => {
  test("should return scam details if found", () => {
    const id = "0x661b";
    const result = getMisuseDetails(id);
    expect(result).toEqual(misused[0]);
  });

  test("should return null if ID does not match any record", () => {
    const id = "non-existing-id";
    const result = getMisuseDetails(id);
    expect(result).toBeNull();
  });

  test("should return null for an empty string ID", () => {
    const id = "";
    const result = getMisuseDetails(id);
    expect(result).toBeNull();
  });
});
