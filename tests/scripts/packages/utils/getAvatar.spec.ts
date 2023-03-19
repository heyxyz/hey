import { expect, test } from '@playwright/test';
import { IPFS_GATEWAY, USER_CONTENT_URL } from 'data/constants';
import getAvatar from 'utils/getAvatar';

test.describe('getAvatar', () => {
  const ipfsLink = `${IPFS_GATEWAY}bafkreianwlir2groq5l52zdnikon4rtgjcostjosaadbbfekgpzhaprmri`;

  test('should return original avatar url if no CDN is set and not on skip list', () => {
    const profile = { picture: { original: { url: ipfsLink } } };
    const result = getAvatar(profile, false);
    expect(result).toBe(ipfsLink);
  });

  test('should use IPFS link when CDN is set and not on skip list', () => {
    const profile = { picture: { uri: ipfsLink, original: { url: ipfsLink } } };
    const result = getAvatar(profile, true);
    expect(result).toBe(`${USER_CONTENT_URL}/300x300/${ipfsLink}`);
  });

  test('should return original avatar url when hostname is in skip list', () => {
    const avatarUrl = 'https://avatar.tobi.sh/1.png';
    const profile = { picture: { uri: avatarUrl, original: { url: avatarUrl } } };
    const result = getAvatar(profile, true);
    expect(result).toBe(avatarUrl);
  });

  test("should use profile's ownedBy address to build URL when all else fails", () => {
    const profile = { ownedBy: '0x3a5bd1e37b099ae3386d13947b6a90d97675e5e3', picture: {} };
    const result = getAvatar(profile, false);
    expect(result).toBe(`https://cdn.stamp.fyi/avatar/eth:${profile.ownedBy}?s=300`);
  });
});
