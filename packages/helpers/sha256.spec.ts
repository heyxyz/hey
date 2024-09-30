import { describe, expect, test } from "vitest";
import sha256 from "./sha256";

describe("sha256", () => {
  test("should return correct sha256 hash for a simple text", () => {
    const text = "hello";
    const expectedHash =
      "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824";
    expect(sha256(text)).toBe(expectedHash);
  });

  test("should return correct sha256 hash for an empty string", () => {
    const text = "";
    const expectedHash =
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
    expect(sha256(text)).toBe(expectedHash);
  });

  test("should return correct sha256 hash for a longer string", () => {
    const text = "The quick brown fox jumps over the lazy dog";
    const expectedHash =
      "d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592";
    expect(sha256(text)).toBe(expectedHash);
  });

  test("should return different hashes for different inputs", () => {
    const text1 = "input1";
    const text2 = "input2";
    const hash1 = sha256(text1);
    const hash2 = sha256(text2);

    expect(hash1).not.toBe(hash2);
  });

  test("should return consistent hash for the same input", () => {
    const text = "consistent";
    const hash1 = sha256(text);
    const hash2 = sha256(text);

    expect(hash1).toBe(hash2);
  });
});
