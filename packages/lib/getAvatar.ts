import { AVATAR, ZERO_ADDRESS } from '@hey/data/constants';

import getStampFyiURL from './getStampFyiURL';
import imageKit from './imageKit';
import sanitizeDStorageUrl from './sanitizeDStorageUrl';

/**
 * Returns the avatar image URL for a given profile.
 *
 * @param profile The profile object.
 * @param namedTransform The named transform to use.
 * @returns The avatar image URL.
 */
const getAvatar = (profile: any, namedTransform = AVATAR): string => {
  const avatarUrl =
    // Group Avatar fallbacks
    profile?.avatar ??
    // Lens Avatar fallbacks
    profile?.metadata?.picture?.image?.optimized?.uri ??
    profile?.metadata?.picture?.raw?.optimized?.uri ??
    profile?.metadata?.picture?.optimized?.uri ??
    profile?.metadata?.picture?.raw?.uri ??
    getStampFyiURL(profile?.ownedBy.address ?? ZERO_ADDRESS);

  return imageKit(sanitizeDStorageUrl(avatarUrl), namedTransform);
};

export default getAvatar;
