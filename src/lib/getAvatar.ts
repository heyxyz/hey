import { Profile } from '@generated/types';

import getIPFSLink from './getIPFSLink';
import imagekitURL from './imagekitURL';

const getAvatar = (profile: Profile): string => {
  return imagekitURL(
    getIPFSLink(
      // @ts-ignore
      profile?.picture?.original?.url ??
        // @ts-ignore
        profile?.picture?.uri ??
        `https://avatar.tobi.sh/${profile?.ownedBy}_${profile?.handle}.png`
    ),
    'avatar'
  );
};

export default getAvatar;
