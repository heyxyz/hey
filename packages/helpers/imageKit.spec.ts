import {
  IPFS_GATEWAY,
  LENS_MEDIA_SNAPSHOT_URL,
  PLACEHOLDER_IMAGE
} from "@hey/data/constants";
import { describe, expect, test } from "vitest";

import imageKit from "./imageKit";

describe("imageKit", () => {
  test("should return empty string if url is not provided", () => {
    const result = imageKit("");
    expect(result).toEqual("");
  });

  test("should return the same url if it includes hey-assets.b-cdn.net", () => {
    const url = PLACEHOLDER_IMAGE;
    const result = imageKit(url);
    expect(result).toEqual(url);
  });

  test("should return an empty string if url is null", () => {
    expect(imageKit(null as any)).toBe("");
  });

  test("should return the original url if it does not include LENS_MEDIA_SNAPSHOT_URL", () => {
    const url = "https://example.com/image.jpg";
    expect(imageKit(url)).toBe(url);
  });

  test("should return the transformed url if it includes LENS_MEDIA_SNAPSHOT_URL", () => {
    const originalUrl = `${LENS_MEDIA_SNAPSHOT_URL}/some-image.jpg`;
    const transformedUrl = `${LENS_MEDIA_SNAPSHOT_URL}/transformed,q-80/some-image.jpg`;

    expect(imageKit(originalUrl, "transformed")).toBe(transformedUrl);
  });

  test("should return the original url if name is not provided", () => {
    const originalUrl = "https://hey.com/some-image.jpg";

    expect(imageKit(originalUrl)).toBe(originalUrl);
  });

  test("should return the imagekit fallback url if direct ipfs gateway is passed", () => {
    const originalUrl = `${IPFS_GATEWAY}/bafkreianwlir2groq5l52zdnikon4rtgjcostjosaadbbfekgpzhaprmri`;

    expect(imageKit(originalUrl, "transformed")).toBe(
      "https://ik.imagekit.io/lensterimg/fallback/transformed,q-80/https://gw.ipfs-lens.dev/ipfs/bafkreianwlir2groq5l52zdnikon4rtgjcostjosaadbbfekgpzhaprmri"
    );
  });
});
