import { AVATAR, ZERO_ADDRESS } from 'data/constants';

import getIPFSLink from './getIPFSLink';
import getStampFyiURL from './getStampFyiURL';
import imageProxy from './imageProxy';

const skipList = ['assets.lenster.xyz', 'cdn.stamp.fyi', 'avataaars.io', 'avatar.tobi.sh'];

/**
 *
 * @param profile - Profile object
 * @param isCdn - To passthrough image proxy
 * @returns avatar image url
 */
const getAvatar = (profile: any, isCdn = true): string => {
  const avatarUrl =
    profile?.picture?.original?.url ??
    profile?.picture?.uri ??
    getStampFyiURL(profile?.ownedBy ?? ZERO_ADDRESS);
  const url = new URL(avatarUrl);

  if (skipList.includes(url.hostname)) {
    return avatarUrl;
  }

  if (isCdn) {
    return imageProxy(getIPFSLink(avatarUrl), AVATAR);
  }

  return getIPFSLink(
    profile?.picture?.original?.url ??
      profile?.picture?.uri ??
      getStampFyiURL(profile?.ownedBy ?? ZERO_ADDRESS)
  );
};

export default getAvatar;
