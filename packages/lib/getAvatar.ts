import { AVATAR, ZERO_ADDRESS } from 'data/constants';

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
    profile?.picture?.original?.url ??
    profile?.picture?.uri ??
    getStampFyiURL(profile?.ownedBy ?? ZERO_ADDRESS);

  return imageKit(sanitizeDStorageUrl(avatarUrl), namedTransform);
};

export default getAvatar;
