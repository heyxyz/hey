import { describe, expect, test } from "vitest";
import getNftChainId from "./getNftChainId";

describe("getNftChainId", () => {
  test("should return 'ethereum' for chain ID '1'", () => {
    const result = getNftChainId("1");
    expect(result).toBe("ethereum");
  });

  test("should return 'goerli' for chain ID '5'", () => {
    const result = getNftChainId("5");
    expect(result).toBe("goerli");
  });

  test("should return 'optimism' for chain ID '10'", () => {
    const result = getNftChainId("10");
    expect(result).toBe("optimism");
  });

  test("should return 'optimism-testnet' for chain ID '69'", () => {
    const result = getNftChainId("69");
    expect(result).toBe("optimism-testnet");
  });

  test("should return 'zora' for chain ID '7777777'", () => {
    const result = getNftChainId("7777777");
    expect(result).toBe("zora");
  });

  test("should return 'zora-testnet' for chain ID '999999999'", () => {
    const result = getNftChainId("999999999");
    expect(result).toBe("zora-testnet");
  });

  test("should return 'base' for chain ID '8453'", () => {
    const result = getNftChainId("8453");
    expect(result).toBe("base");
  });

  test("should return 'base-testnet' for chain ID '84531'", () => {
    const result = getNftChainId("84531");
    expect(result).toBe("base-testnet");
  });

  test("should return 'polygon' for chain ID '137'", () => {
    const result = getNftChainId("137");
    expect(result).toBe("polygon");
  });

  test("should return 'amoy' for chain ID '80002'", () => {
    const result = getNftChainId("80002");
    expect(result).toBe("amoy");
  });

  test("should return 'ethereum' for an unknown chain ID", () => {
    const result = getNftChainId("unknown");
    expect(result).toBe("ethereum");
  });

  test("should return 'ethereum' for an empty string as chain ID", () => {
    const result = getNftChainId("");
    expect(result).toBe("ethereum");
  });

  test("should return 'ethereum' for a non-existent numeric chain ID", () => {
    const result = getNftChainId("99999");
    expect(result).toBe("ethereum");
  });
});
