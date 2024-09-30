import { STATIC_IMAGES_URL } from "@hey/data/constants";
import { describe, expect, test } from "vitest";
import getThumbnailUrl from "./getThumbnailUrl";

describe("getThumbnailUrl", () => {
  const mockMetadata = {
    cover: {
      optimized: { uri: "https://example.com/cover.png" },
      raw: { uri: null }
    }
  };

  test("should return the thumbnail fallback URL if no metadata is provided", () => {
    const metadata = undefined;
    const result = getThumbnailUrl(metadata);
    const expectedUrl = `${STATIC_IMAGES_URL}/thumbnail.png`;
    expect(result).toEqual(expectedUrl);
  });

  test("should return the original cover URL if available", () => {
    const metadata = mockMetadata;
    const result = getThumbnailUrl(metadata as any);
    expect(result).toEqual("https://example.com/cover.png");
  });

  test("should return the fallback thumbnail URL if no cover URL is available", () => {
    const metadata = { ...mockMetadata, cover: undefined };
    const result = getThumbnailUrl(metadata as any);
    const expectedUrl = `${STATIC_IMAGES_URL}/thumbnail.png`;
    expect(result).toEqual(expectedUrl);
  });

  test("should return fallback thumbnail if cover's optimized uri is null", () => {
    const metadata = {
      cover: {
        optimized: { uri: null },
        raw: { uri: "https://example.com/cover-raw.png" }
      }
    };
    const result = getThumbnailUrl(metadata as any);
    const expectedUrl = `${STATIC_IMAGES_URL}/thumbnail.png`;
    expect(result).toEqual(expectedUrl);
  });

  test("should return fallback thumbnail if optimized uri is an empty string", () => {
    const metadata = {
      cover: {
        optimized: { uri: "" },
        raw: { uri: "https://example.com/cover-raw.png" }
      }
    };
    const result = getThumbnailUrl(metadata as any);
    const expectedUrl = `${STATIC_IMAGES_URL}/thumbnail.png`;
    expect(result).toEqual(expectedUrl);
  });
});
