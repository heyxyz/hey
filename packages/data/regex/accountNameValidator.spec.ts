import { describe, expect, test } from "vitest";
import { Regex } from "../regex";

describe("Regex.accountNameValidator", () => {
  test("should return true for a valid account name with no restricted symbols", () => {
    const name = "JohnDoe123";
    const result = Regex.accountNameValidator.test(name);
    expect(result).toBe(true);
  });

  test("should return false for a account name with a restricted symbol at the end", () => {
    const name = "JohnDoe123✅";
    const result = Regex.accountNameValidator.test(name);
    expect(result).toBe(false);
  });

  test("should return false for a account name with a restricted symbol at the beginning", () => {
    const name = "☑️JohnDoe123";
    const result = Regex.accountNameValidator.test(name);
    expect(result).toBe(false);
  });

  test("should return false for a account name with restricted symbols in the middle", () => {
    const name = "John✅Doe";
    const result = Regex.accountNameValidator.test(name);
    expect(result).toBe(false);
  });

  test("should return true for a valid account name with only letters and numbers", () => {
    const name = "JaneDoe456";
    const result = Regex.accountNameValidator.test(name);
    expect(result).toBe(true);
  });

  test("should return false for a account name with only restricted symbols", () => {
    const name = "☑️✅✔️";
    const result = Regex.accountNameValidator.test(name);
    expect(result).toBe(false);
  });

  test("should return false for an empty account name", () => {
    const name = "";
    const result = Regex.accountNameValidator.test(name);
    expect(result).toBe(false);
  });

  test("should return true for a account name with spaces but no restricted symbols", () => {
    const name = "John Doe";
    const result = Regex.accountNameValidator.test(name);
    expect(result).toBe(true);
  });

  test("should return false for a account name with trailing restricted symbols", () => {
    const name = "JohnDoe ✔️";
    const result = Regex.accountNameValidator.test(name);
    expect(result).toBe(false);
  });

  test("should return false for a account name with a single restricted symbol", () => {
    const name = "JaneDoe✓";
    const result = Regex.accountNameValidator.test(name);
    expect(result).toBe(false);
  });
});
