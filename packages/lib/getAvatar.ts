import { AVATAR, ZERO_ADDRESS } from 'data/constants';
import getStampFyiURL from 'lib/getStampFyiURL';
import imageProxy from 'lib/imageProxy';
import sanitizeDStorageUrl from 'lib/sanitizeDStorageUrl';

/**
 * The list of hostnames to skip image proxy for.
 */
const SKIP_LIST = ['static-assets.lenster.xyz', 'avataaars.io', 'avatar.tobi.sh'];

/**
 * Returns the avatar image URL for a given profile.
 *
 * @param profile The profile object.
 * @param useImageProxy Whether to use the image proxy.
 * @returns The avatar image URL.
 */
const getAvatar = (profile: any, useImageProxy = true): string => {
  const avatarUrl =
    profile?.picture?.original?.url ??
    profile?.picture?.uri ??
    getStampFyiURL(profile?.ownedBy ?? ZERO_ADDRESS);
  const url = new URL(avatarUrl);

  if (SKIP_LIST.includes(url.hostname)) {
    return avatarUrl;
  }

  return useImageProxy ? imageProxy(sanitizeDStorageUrl(avatarUrl), AVATAR) : sanitizeDStorageUrl(avatarUrl);
};

export default getAvatar;
