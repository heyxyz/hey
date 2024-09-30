import { describe, expect, test } from "vitest";
import getFavicon from "./getFavicon";

describe("getFavicon", () => {
  test("should return the correct favicon URL for a given URL", () => {
    const url = "https://hey.xyz";
    const expectedFaviconUrl =
      "https://external-content.duckduckgo.com/ip3/hey.xyz.ico";
    const result = getFavicon(url);

    expect(result).toBe(expectedFaviconUrl);
  });

  test('should handle URLs with "http://" prefix correctly', () => {
    const url = "http://hey.xyz";
    const expectedFaviconUrl =
      "https://external-content.duckduckgo.com/ip3/hey.xyz.ico";
    const result = getFavicon(url);

    expect(result).toBe(expectedFaviconUrl);
  });

  test('should handle URLs with "https://" prefix correctly', () => {
    const url = "https://hey.xyz";
    const expectedFaviconUrl =
      "https://external-content.duckduckgo.com/ip3/hey.xyz.ico";
    const result = getFavicon(url);

    expect(result).toBe(expectedFaviconUrl);
  });

  test("should handle URLs with path correctly", () => {
    const url = "https://hey.xyz/u/yoginth";
    const expectedFaviconUrl =
      "https://external-content.duckduckgo.com/ip3/hey.xyz.ico";
    const result = getFavicon(url);

    expect(result).toBe(expectedFaviconUrl);
  });

  // Additional test cases

  test("should handle subdomains correctly", () => {
    const url = "https://blog.hey.xyz";
    const expectedFaviconUrl =
      "https://external-content.duckduckgo.com/ip3/blog.hey.xyz.ico";
    const result = getFavicon(url);

    expect(result).toBe(expectedFaviconUrl);
  });

  test("should handle URLs without protocol (assumed as https)", () => {
    const url = "hey.xyz";
    const expectedFaviconUrl =
      "https://external-content.duckduckgo.com/ip3/hey.xyz.ico";
    const result = getFavicon(`https://${url}`);

    expect(result).toBe(expectedFaviconUrl);
  });

  test("should handle localhost URLs correctly", () => {
    const url = "http://localhost:3000";
    const expectedFaviconUrl =
      "https://external-content.duckduckgo.com/ip3/localhost.ico";
    const result = getFavicon(url);

    expect(result).toBe(expectedFaviconUrl);
  });

  test("should handle IP address URLs correctly", () => {
    const url = "http://192.168.0.1";
    const expectedFaviconUrl =
      "https://external-content.duckduckgo.com/ip3/192.168.0.1.ico";
    const result = getFavicon(url);

    expect(result).toBe(expectedFaviconUrl);
  });

  test("should handle URLs with query parameters correctly", () => {
    const url = "https://hey.xyz?query=test";
    const expectedFaviconUrl =
      "https://external-content.duckduckgo.com/ip3/hey.xyz.ico";
    const result = getFavicon(url);

    expect(result).toBe(expectedFaviconUrl);
  });
});
