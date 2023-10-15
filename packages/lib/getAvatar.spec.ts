import { IPFS_GATEWAY } from '@hey/data/constants';
import { describe, expect, test } from 'vitest';

import getAvatar from './getAvatar';

describe('getAvatar', () => {
  const ipfsLink = `${IPFS_GATEWAY}bafkreianwlir2groq5l52zdnikon4rtgjcostjosaadbbfekgpzhaprmri`;

  test('should return original avatar url', () => {
    const profile = { picture: { original: { url: ipfsLink } } };
    const result = getAvatar(profile);
    expect(result).toBe(ipfsLink);
  });

  test('should return original avatar url when hostname is in skip list', () => {
    const avatarUrl = 'https://avatar.tobi.sh/1.png';
    const profile = {
      picture: { uri: avatarUrl, original: { url: avatarUrl } }
    };
    const result = getAvatar(profile);
    expect(result).toBe(avatarUrl);
  });

  test("should use profile's ownedBy address to build URL when all else fails", () => {
    const profile = {
      ownedBy: '0x03ba34f6ea1496fa316873cf8350a3f7ead317ef',
      picture: {}
    };
    const result = getAvatar(profile);
    expect(result).toBe(
      `https://cdn.stamp.fyi/avatar/eth:${profile.ownedBy}?s=300`
    );
  });
});
