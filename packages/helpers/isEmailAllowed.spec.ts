import { describe, expect, test } from "vitest";
import isEmailAllowed from "./isEmailAllowed";

describe("isEmailAllowed", () => {
  test("should return false if it's 'bademail'", () => {
    const result = isEmailAllowed("bademail");
    expect(result).toBe(false);
  });

  test("should return false if it's from our list 'yoginth@mail3.me'", () => {
    const result = isEmailAllowed("yoginth@mail3.me");
    expect(result).toBe(false);
  });

  test("should return false if it's 'yoginth@yopmail.com'", () => {
    const result = isEmailAllowed("yoginth@yopmail.com");
    expect(result).toBe(false);
  });

  test("should return true if it's 'yoginth@gmail.com'", () => {
    const result = isEmailAllowed("yoginth@gmail.com");
    expect(result).toBe(true);
  });

  test("should return true if it's 'hey@yoginth.com'", () => {
    const result = isEmailAllowed("hey@yoginth.com");
    expect(result).toBe(true);
  });
});
