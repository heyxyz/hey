import { misused } from "@hey/data/misused";
import { describe, expect, test } from "vitest";

import getMisuseDetails from "./getMisuseDetails";

describe("getMisuseDetails", () => {
  test("should return scam details if found", () => {
    const id = "0x661b";
    const result = getMisuseDetails(id);

    expect(result).toEqual(misused[0]);
  });

  test("should return null if scam details are not found", () => {
    const id = "3";
    const result = getMisuseDetails(id);

    expect(result).toBeNull();
  });
});
