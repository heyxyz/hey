import { describe, expect, test } from "vitest";

import { Regex } from "../../regex";

const validate = (text: string) => {
  Regex.ethereumAddress.lastIndex = 0;
  return Regex.ethereumAddress.test(text);
};

describe("ethereumAddress regex", () => {
  test("should pass for valid Ethereum addresses", () => {
    expect(validate("0x5AEDA56215b167893e80B4fE645BA6d5Bab767DE")).toBe(true);
    expect(validate("5aeda56215b167893e80b4fe645ba6d5bab767de")).toBe(true);
    expect(validate("0xB794F5eA0ba39494cE839613fffBA74279579268")).toBe(true);
  });

  test("should fail for Ethereum addresses with invalid characters", () => {
    expect(validate("0xG28F3B8e87E48F7F32A7D4e1df178aE9F14b0Ee2")).toBe(false);
    expect(validate("0xabcdefg0123456789abcdef0123456789abcdef")).toBe(false);
    expect(validate("0x5aeda56215b167893e80b4fe645ba6d5bab767deg")).toBe(false);
  });

  test("should fail for Ethereum addresses with incorrect length", () => {
    expect(validate("0x5AEDA56215b167893e80B4fE645BA6d5Bab767D")).toBe(false);
    expect(validate("0xB794F5eA0ba39494cE839613fffBA742795792688")).toBe(false);
  });

  test("should fail for empty string", () => {
    expect(validate("")).toBe(false);
  });
});
