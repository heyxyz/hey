import { describe, expect, test } from "vitest";

import { Regex } from "../../regex";

const validate = (text: string) => {
  Regex.url.lastIndex = 0;
  return Regex.url.test(text);
};

describe("url regex", () => {
  test("should pass for valid URLs", () => {
    expect(validate("http://www.example.com")).toBe(true);
    expect(validate("https://www.example.com")).toBe(true);
    expect(validate("http://subdomain.example.com")).toBe(true);
    expect(validate("https://www.example.com/path/to/something")).toBe(true);
    expect(validate("http://www.example.com/page?id=123&name=John")).toBe(true);
    expect(validate("https://www.example.com/@username")).toBe(true);
    expect(validate("https://www.example.com/#selector")).toBe(true);
  });

  test("should fail for invalid URLs", () => {
    expect(validate("www.example.com")).toBe(false);
    expect(validate("example.com")).toBe(false);
    expect(validate("example")).toBe(false);
    expect(validate("example.")).toBe(false);
    expect(validate("example.c")).toBe(false);
  });

  test("should pass for multiple URLs in the same string", () => {
    expect(
      validate(
        "Check out this website: https://www.example.com and also https://sub.example.com"
      )
    ).toBe(true);
  });
});
