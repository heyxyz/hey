import {
  AVATAR,
  HEY_API_URL,
  HEY_IMAGEKIT_URL,
  IPFS_GATEWAY,
  TEST_LENS_ID
} from "@hey/data/constants";
import { describe, expect, test } from "vitest";
import getAvatar from "./getAvatar";

describe("getAvatar", () => {
  const ipfsLink = `${IPFS_GATEWAY}/bafkreianwlir2groq5l52zdnikon4rtgjcostjosaadbbfekgpzhaprmri`;
  const imagekitUrl = `${HEY_IMAGEKIT_URL}/fallback/${AVATAR},q-80/https://gw.ipfs-lens.dev/ipfs/bafkreianwlir2groq5l52zdnikon4rtgjcostjosaadbbfekgpzhaprmri`;

  test("should return normal profile optimized avatar url", () => {
    const profile = {
      metadata: { picture: { optimized: { uri: ipfsLink } } }
    };
    const result = getAvatar(profile);
    expect(result).toBe(imagekitUrl);
  });

  test("should return normal profile optimized raw url", () => {
    const profile = {
      metadata: { picture: { raw: { uri: ipfsLink } } }
    };
    const result = getAvatar(profile);
    expect(result).toBe(imagekitUrl);
  });

  test("should return nft profile optimized avatar url", () => {
    const profile = {
      metadata: { picture: { image: { optimized: { uri: ipfsLink } } } }
    };
    const result = getAvatar(profile);
    expect(result).toBe(imagekitUrl);
  });

  test("should return nft profile optimized raw url", () => {
    const profile = {
      metadata: { picture: { image: { raw: { uri: ipfsLink } } } }
    };
    const result = getAvatar(profile);
    expect(result).toBe(imagekitUrl);
  });

  test("should use profile's ownedBy address to build URL when all else fails", () => {
    const profile = { id: TEST_LENS_ID };
    const result = getAvatar(profile);
    expect(result).toBe(`${HEY_API_URL}/avatar?id=${TEST_LENS_ID}`);
  });

  test("should handle profiles with metadata but no picture field", () => {
    const profile = { metadata: {} };
    const result = getAvatar(profile);
    expect(result).toBe(`${HEY_API_URL}/avatar`);
  });

  test("should return sanitized URL for valid IPFS link", () => {
    const profile = {
      metadata: { picture: { optimized: { uri: ipfsLink } } }
    };
    const result = getAvatar(profile);
    expect(result.startsWith(`${HEY_IMAGEKIT_URL}/fallback/${AVATAR}`)).toBe(
      true
    );
  });

  test("should apply named transform to valid avatar URL", () => {
    const profile = {
      metadata: { picture: { optimized: { uri: ipfsLink } } }
    };
    const result = getAvatar(profile, "custom-transform");
    expect(result).toContain("/fallback/custom-transform,");
  });
});
