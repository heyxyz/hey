import { IPFS_GATEWAY } from '@hey/data/constants';
import { describe, expect, test } from 'vitest';

import getAvatar from './getAvatar';

describe('getAvatar', () => {
  const ipfsLink = `${IPFS_GATEWAY}bafkreianwlir2groq5l52zdnikon4rtgjcostjosaadbbfekgpzhaprmri`;

  test('should return normal profile optimized avatar url', () => {
    const profile = {
      metadata: { picture: { optimized: { uri: ipfsLink } } },
      ownedBy: { address: '0x03ba34f6ea1496fa316873cf8350a3f7ead317ef' }
    };
    const result = getAvatar(profile);
    expect(result).toBe(ipfsLink);
  });

  test('should return normal profile optimized raw url', () => {
    const profile = {
      metadata: { picture: { raw: { uri: ipfsLink } } },
      ownedBy: { address: '0x03ba34f6ea1496fa316873cf8350a3f7ead317ef' }
    };
    const result = getAvatar(profile);
    expect(result).toBe(ipfsLink);
  });

  test('should return nft profile optimized avatar url', () => {
    const profile = {
      metadata: { picture: { image: { optimized: { uri: ipfsLink } } } },
      ownedBy: { address: '0x03ba34f6ea1496fa316873cf8350a3f7ead317ef' }
    };
    const result = getAvatar(profile);
    expect(result).toBe(ipfsLink);
  });

  test('should return nft profile optimized raw url', () => {
    const profile = {
      metadata: { picture: { image: { raw: { uri: ipfsLink } } } },
      ownedBy: { address: '0x03ba34f6ea1496fa316873cf8350a3f7ead317ef' }
    };
    const result = getAvatar(profile);
    expect(result).toBe(ipfsLink);
  });

  test("should use profile's ownedBy address to build URL when all else fails", () => {
    const profile = {
      ownedBy: { address: '0x03ba34f6ea1496fa316873cf8350a3f7ead317ef' },
      picture: {}
    };
    const result = getAvatar(profile);
    expect(result).toBe(
      `https://cdn.stamp.fyi/avatar/eth:${profile.ownedBy.address}?s=300`
    );
  });
});
