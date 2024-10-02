import { HEY_IMAGEKIT_URL } from "@hey/data/constants";
import { describe, expect, test } from "vitest";
import getProxyUrl from "./getProxyUrl";

describe("getProxyUrl", () => {
  const mockImageKitUrl = HEY_IMAGEKIT_URL;

  test("should return the original URL if it's a direct URL (Zora)", () => {
    const url = "https://zora.co/api/thumbnail/example.jpg";
    const result = getProxyUrl(url);
    expect(result).toBe(url);
  });

  test("should return the original URL if it's a direct URL (Lu.ma)", () => {
    const url = "https://social-images.lu.ma/example.jpg";
    const result = getProxyUrl(url);
    expect(result).toBe(url);
  });

  test("should return the original URL if it's a direct URL (Drips)", () => {
    const url = "https://drips.network/example.jpg";
    const result = getProxyUrl(url);
    expect(result).toBe(url);
  });

  test("should return a proxied URL if it's not a direct URL", () => {
    const url = "https://example.com/image.jpg";
    const result = getProxyUrl(url);
    expect(result).toBe(
      `${mockImageKitUrl}/oembed/tr:di-placeholder.webp,h-400,w-400/${url}`
    );
  });

  test("should return null if the URL is empty", () => {
    const url = "";
    const result = getProxyUrl(url);
    expect(result).toBeNull();
  });

  test("should return a proxied URL if the URL is from a different domain", () => {
    const url = "https://randomwebsite.com/image.jpg";
    const result = getProxyUrl(url);
    expect(result).toBe(
      `${mockImageKitUrl}/oembed/tr:di-placeholder.webp,h-400,w-400/${url}`
    );
  });
});
