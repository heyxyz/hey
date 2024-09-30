import { describe, expect, test } from "vitest";
import truncateUrl from "./truncateUrl";

describe("truncateUrl", () => {
  test("should strip http(s) and www", () => {
    const url = "https://www.example.com/foo";
    expect(truncateUrl(url, 30)).toEqual("example.com/foo");
  });

  test("should truncate url that is longer than max length", () => {
    const url = "https://example.com/path?key=value";
    expect(truncateUrl(url, 20)).toEqual("example.com/path?ke…");
  });

  test("should not truncate url that is max length or shorter (after prefix stripped)", () => {
    const maxLengthUrl = "https://example.com/pathname";
    const shortUrl = "https://example.com/foo";
    expect(truncateUrl(maxLengthUrl, 20)).toEqual("example.com/pathname");
    expect(truncateUrl(shortUrl, 20)).toEqual("example.com/foo");
  });

  test("should not truncate *.hey.xyz url", () => {
    const mainnetUrl = "https://hey.xyz/long/pathname/test";
    expect(truncateUrl(mainnetUrl, 20)).toEqual("hey.xyz/long/pathname/test");
  });

  test("should handle urls without www and https", () => {
    const url = "http://example.com/foo/bar";
    expect(truncateUrl(url, 30)).toEqual("example.com/foo/bar");
  });

  test("should handle urls with subdomains", () => {
    const url = "https://sub.example.com/foo";
    expect(truncateUrl(url, 20)).toEqual("sub.example.com/foo");
  });

  test("should handle very short urls", () => {
    const url = "https://a.com";
    expect(truncateUrl(url, 10)).toEqual("a.com");
  });

  test("should handle exactly max length urls", () => {
    const url = "https://example.com/foo";
    expect(truncateUrl(url, 17)).toEqual("example.com/foo");
  });

  test("should return the stripped url when it ends with *.hey.xyz", () => {
    const heyUrl = "https://subdomain.hey.xyz/test/path";
    expect(truncateUrl(heyUrl, 10)).toEqual("subdomain.hey.xyz/test/path");
  });

  test("should handle urls with query parameters", () => {
    const url = "https://example.com/foo?param=value&other=foo";
    expect(truncateUrl(url, 25)).toEqual("example.com/foo?param=va…");
  });
});
