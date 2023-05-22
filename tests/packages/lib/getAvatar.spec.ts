import { expect, test } from '@playwright/test';
import { IPFS_GATEWAY } from 'data/constants';
import getAvatar from 'lib/getAvatar';

test.describe('getAvatar', () => {
  const ipfsLink = `${IPFS_GATEWAY}bafkreianwlir2groq5l52zdnikon4rtgjcostjosaadbbfekgpzhaprmri`;

  test('should return original avatar url', () => {
    const profile = { picture: { original: { url: ipfsLink } } };
    const result = getAvatar(profile);
    expect(result).toBe(ipfsLink);
  });

  test.skip('should return original avatar url when hostname is in skip list', () => {
    const avatarUrl = 'https://avatar.tobi.sh/1.png';
    const profile = {
      picture: { uri: avatarUrl, original: { url: avatarUrl } }
    };
    const result = getAvatar(profile);
    expect(result).toBe(avatarUrl);
  });

  test("should use profile's ownedBy address to build URL when all else fails", () => {
    const profile = {
      ownedBy: '0x3a5bd1e37b099ae3386d13947b6a90d97675e5e3',
      picture: {}
    };
    const result = getAvatar(profile);
    expect(result).toBe(
      `https://cdn.stamp.fyi/avatar/eth:${profile.ownedBy}?s=300`
    );
  });
});
