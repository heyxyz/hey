import { describe, expect, test } from "vitest";

import getURLs from "./getURLs";

describe("getURLs", () => {
  test("should return empty array when no URLs are found", () => {
    const text = "This text does not contain any URLs";
    expect(getURLs(text)).toEqual([]);
  });

  test("should return array containing all URLs in the given text", () => {
    const text = "Here is an example text with a URL: https://example.com";
    const expectedUrls = ["https://example.com"];
    expect(getURLs(text)).toEqual(expectedUrls);
  });

  test("should match both http and https protocols and www subdomains", () => {
    const text =
      "Here are some URLs: https://example.com http://www.example.net";
    const expectedUrls = ["https://example.com", "http://www.example.net"];
    expect(getURLs(text)).toEqual(expectedUrls);
  });

  test("should match multiple occurrences of URLs in the same text", () => {
    const text = "URL1: https://example.com URL2: http://www.example.net";
    const expectedUrls = ["https://example.com", "http://www.example.net"];
    expect(getURLs(text)).toEqual(expectedUrls);
  });

  test("should not match trailing parentesis", () => {
    const text =
      "URL1: (https://example.com/) URL2: (https://example.net) URL3: (https://example.net). test";
    const expectedUrls = [
      "https://example.com/",
      "https://example.net",
      "https://example.net"
    ];
    expect(getURLs(text)).toEqual(expectedUrls);
  });

  test("should handle international characters", () => {
    const text = "URL1: http://example.com/引き割り.html";
    const expectedUrls = ["http://example.com/引き割り.html"];
    expect(getURLs(text)).toEqual(expectedUrls);
  });

  test("should handle trailing full stop", () => {
    const text =
      "i have visited http://example.com, http://example.net. https://example.net/.";
    const expectedUrls = [
      "http://example.com",
      "http://example.net",
      "https://example.net/"
    ];
    expect(getURLs(text)).toEqual(expectedUrls);
  });
});
