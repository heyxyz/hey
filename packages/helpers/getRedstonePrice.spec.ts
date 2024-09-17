import { describe, expect, test } from "vitest";

import getRedstonePrice from "./getRedstonePrice";

describe("getRedstonePrice", () => {
  test("should return symbol", async () => {
    const price = await getRedstonePrice("USDC");
    expect(price).toBeGreaterThan(0);
  });
});
