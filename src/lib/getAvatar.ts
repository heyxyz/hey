import { ZERO_ADDRESS } from 'src/constants';

import getIPFSLink from './getIPFSLink';
import getStampFyiURL from './getStampFyiURL';
import imagekitURL from './imagekitURL';

/**
 *
 * @param profile - Profile object
 * @returns avatar image url
 */
const getAvatar = (profile: any): string => {
  return imagekitURL(
    getIPFSLink(
      profile?.picture?.original?.url ??
        profile?.picture?.uri ??
        getStampFyiURL(profile?.ownedBy ?? ZERO_ADDRESS)
    ),
    'avatar'
  );
};

export default getAvatar;
