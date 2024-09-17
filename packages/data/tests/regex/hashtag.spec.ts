import { describe, expect, test } from "vitest";

import { Regex } from "../../regex";

const validate = (text: string) => {
  Regex.hashtag.lastIndex = 0;
  return Regex.hashtag.test(text);
};

describe("hashtag regex", () => {
  test("should pass for valid hashtags", () => {
    expect(validate("#hashtag")).toBe(true);
    expect(validate("#HelloWorld")).toBe(true);
    expect(validate("#_underscored_tag_")).toBe(true);
    expect(validate("#123number")).toBe(true);
  });

  test("should fail for hashtags filled with a digit", () => {
    expect(validate("#2024")).toBe(false);
  });

  test("should fail for hashtags without any alphabet characters", () => {
    expect(validate("#123")).toBe(false);
    expect(validate("#_!@")).toBe(false);
  });

  test("should fail for empty string", () => {
    expect(validate("")).toBe(false);
    expect(validate("#")).toBe(false);
  });
});
