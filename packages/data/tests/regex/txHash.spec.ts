import { describe, expect, test } from "vitest";
import { Regex } from "../../regex";

describe("Regex.txHash", () => {
  test("should match a valid lowercase Ethereum transaction hash", () => {
    const txHash =
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
    const result = Regex.txHash.test(txHash);
    expect(result).toBe(true);
  });

  test("should match a valid mixed case Ethereum transaction hash", () => {
    const txHash =
      "0x1234567890ABCDEF1234567890abcdef1234567890ABCDEF1234567890abcdef";
    const result = Regex.txHash.test(txHash);
    expect(result).toBe(true);
  });

  test("should match a valid uppercase Ethereum transaction hash", () => {
    const txHash =
      "0xABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890";
    const result = Regex.txHash.test(txHash);
    expect(result).toBe(true);
  });

  test("should not match an invalid Ethereum transaction hash (missing 0x prefix)", () => {
    const txHash =
      "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
    const result = Regex.txHash.test(txHash);
    expect(result).toBe(false);
  });

  test("should not match an Ethereum transaction hash that is too short", () => {
    const txHash = "0x1234567890abcdef1234567890abcdef";
    const result = Regex.txHash.test(txHash);
    expect(result).toBe(false);
  });

  test("should not match an Ethereum transaction hash with non-hex characters", () => {
    const txHash =
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890zzzzzz";
    const result = Regex.txHash.test(txHash);
    expect(result).toBe(false);
  });

  test("should match a valid Ethereum transaction hash without case sensitivity", () => {
    const txHash =
      "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd";
    const result = Regex.txHash.test(txHash);
    expect(result).toBe(true);
  });

  test("should not match a string that starts like a transaction hash but is too long", () => {
    const txHash =
      "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdefabcdef";
    const result = Regex.txHash.test(txHash);
    expect(result).toBe(false);
  });
});
