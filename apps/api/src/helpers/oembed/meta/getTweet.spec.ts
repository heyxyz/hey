import { describe, expect, test } from "vitest";
import getTweet from "./getTweet";

describe("getTweet", () => {
  test("should return the tweet ID for a valid twitter.com URL", () => {
    const url = "https://twitter.com/user/status/1234567890123456789";
    const result = getTweet(url);

    expect(result).toBe("1234567890123456789");
  });

  test("should return the tweet ID for a valid x.com URL", () => {
    const url = "https://x.com/user/status/9876543210987654321";
    const result = getTweet(url);

    expect(result).toBe("9876543210987654321");
  });

  test("should return null for a twitter.com URL without a status path", () => {
    const url = "https://twitter.com/user/profile";
    const result = getTweet(url);

    expect(result).toBeNull();
  });

  test("should return null for a non-twitter.com or non-x.com URL", () => {
    const url = "https://example.com/user/status/1234567890123456789";
    const result = getTweet(url);

    expect(result).toBeNull();
  });

  test("should return null for an invalid URL", () => {
    const url = "invalid-url";
    const result = getTweet(url);

    expect(result).toBeNull();
  });
});
