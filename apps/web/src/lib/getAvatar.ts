import { AVATAR, ZERO_ADDRESS } from 'data/constants';

import getIPFSLink from './getIPFSLink';
import getStampFyiURL from './getStampFyiURL';
import imageProxy from './imageProxy';

/**
 *
 * @param profile - Profile object
 * @param isCdn - To passthrough image proxy
 * @returns avatar image url
 */
const getAvatar = (profile: any, isCdn = true): string => {
  if (isCdn) {
    return imageProxy(
      getIPFSLink(
        profile?.picture?.original?.url ??
          profile?.picture?.uri ??
          getStampFyiURL(profile?.ownedBy ?? ZERO_ADDRESS)
      ),
      AVATAR
    );
  }

  return getIPFSLink(
    profile?.picture?.original?.url ??
      profile?.picture?.uri ??
      getStampFyiURL(profile?.ownedBy ?? ZERO_ADDRESS)
  );
};

export default getAvatar;
