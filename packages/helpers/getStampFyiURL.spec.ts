import { describe, expect, test } from "vitest";

import getStampFyiURL from "./getStampFyiURL";

describe("getStampFyiURL", () => {
  const address = "0x1234567890123456789012345678901234567890";
  const expectedURL = `https://cdn.stamp.fyi/avatar/eth:${address.toLowerCase()}?s=300`;

  test("should return the correct URL for a valid Ethereum address", () => {
    const result = getStampFyiURL(address);
    expect(result).toBe(expectedURL);
  });

  test("should return the same URL if called multiple times with the same argument", () => {
    const result1 = getStampFyiURL(address);
    const result2 = getStampFyiURL(address);
    expect(result1).toBe(expectedURL);
    expect(result2).toBe(expectedURL);
  });
});
