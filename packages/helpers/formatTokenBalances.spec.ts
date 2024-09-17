import { describe, expect, it } from "vitest";

import formatTokenBalances from "./formatTokenBalances";

describe("formatTokenBalances", () => {
  it("should correctly format balances and calculate USD values", () => {
    const balances = {
      USDC: {
        decimals: 6,
        fiatRate: 1,
        value: BigInt(1000000),
        visibleDecimals: 2
      },
      WETH: {
        decimals: 18,
        fiatRate: 3000,
        value: BigInt(500000000000000000),
        visibleDecimals: 4
      },
      WMATIC: {
        decimals: 18,
        fiatRate: 1.5,
        value: BigInt(2000000000000000000),
        visibleDecimals: 2
      }
    };

    const expected = {
      USDC: { token: "1.00", usd: "1.00" },
      WETH: { token: "0.5000", usd: "1500.00" },
      WMATIC: { token: "2.00", usd: "3.00" }
    };

    expect(formatTokenBalances(balances)).toEqual(expected);
  });

  it("should handle zero balances correctly", () => {
    const balances = {
      USDC: { decimals: 6, fiatRate: 1, value: BigInt(0), visibleDecimals: 4 }
    };

    const expected = {
      USDC: { token: "0.0000", usd: "0.00" }
    };

    expect(formatTokenBalances(balances)).toEqual(expected);
  });

  // Additional tests can include edge cases, invalid inputs, etc.
});
