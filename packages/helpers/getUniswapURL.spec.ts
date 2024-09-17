import { describe, expect, test } from "vitest";

import getUniswapURL from "./getUniswapURL";

describe("getUniswapURL", () => {
  test("should return a valid URL", () => {
    const amount = 123.45;
    const outputCurrency = "0x0123456789abcdef";
    const expectedURL =
      "https://app.uniswap.org/#/swap?chain=polygon&exactAmount=123.45&exactField=output&outputCurrency=0x0123456789abcdef";
    const result = getUniswapURL(amount, outputCurrency);
    expect(result).toBe(expectedURL);
  });

  test("should handle zero amount", () => {
    const amount = 0;
    const outputCurrency = "0x0123456789abcdef";
    const expectedURL =
      "https://app.uniswap.org/#/swap?chain=polygon&exactAmount=0&exactField=output&outputCurrency=0x0123456789abcdef";
    const result = getUniswapURL(amount, outputCurrency);
    expect(result).toBe(expectedURL);
  });

  test("should handle empty output currency", () => {
    const amount = 123.45;
    const outputCurrency = "";
    // Note: The resulting URL will still contain "&outputCurrency=", but with an empty value.
    const expectedURL =
      "https://app.uniswap.org/#/swap?chain=polygon&exactAmount=123.45&exactField=output&outputCurrency=";
    const result = getUniswapURL(amount, outputCurrency);
    expect(result).toBe(expectedURL);
  });
});
