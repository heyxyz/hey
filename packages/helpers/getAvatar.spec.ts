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
  const imagekitUrl = `${HEY_IMAGEKIT_URL}/fallback/${AVATAR}/https://gw.ipfs-lens.dev/ipfs/bafkreianwlir2groq5l52zdnikon4rtgjcostjosaadbbfekgpzhaprmri`;

  test("should return normal account optimized avatar url", () => {
    const account = {
      metadata: { picture: { optimized: { uri: ipfsLink } } }
    };
    const result = getAvatar(account);
    expect(result).toBe(imagekitUrl);
  });

  test("should return normal account optimized raw url", () => {
    const account = {
      metadata: { picture: { raw: { uri: ipfsLink } } }
    };
    const result = getAvatar(account);
    expect(result).toBe(imagekitUrl);
  });

  test("should return nft account optimized avatar url", () => {
    const account = {
      metadata: { picture: { image: { optimized: { uri: ipfsLink } } } }
    };
    const result = getAvatar(account);
    expect(result).toBe(imagekitUrl);
  });

  test("should return nft account optimized raw url", () => {
    const account = {
      metadata: { picture: { image: { raw: { uri: ipfsLink } } } }
    };
    const result = getAvatar(account);
    expect(result).toBe(imagekitUrl);
  });

  test("should use account's ownedBy address to build URL when all else fails", () => {
    const account = { id: TEST_LENS_ID };
    const result = getAvatar(account);
    expect(result).toBe(`${HEY_API_URL}/avatar?id=${TEST_LENS_ID}`);
  });

  test("should handle profiles with metadata but no picture field", () => {
    const account = { metadata: {} };
    const result = getAvatar(account);
    expect(result).toBe(`${HEY_API_URL}/avatar`);
  });

  test("should return sanitized URL for valid IPFS link", () => {
    const account = {
      metadata: { picture: { optimized: { uri: ipfsLink } } }
    };
    const result = getAvatar(account);
    expect(result.startsWith(`${HEY_IMAGEKIT_URL}/fallback/${AVATAR}`)).toBe(
      true
    );
  });

  test("should apply named transform to valid avatar URL", () => {
    const account = {
      metadata: { picture: { optimized: { uri: ipfsLink } } }
    };
    const result = getAvatar(account, "custom-transform");
    expect(result).toContain(
      `${HEY_IMAGEKIT_URL}/fallback/custom-transform/${ipfsLink}`
    );
  });
});
