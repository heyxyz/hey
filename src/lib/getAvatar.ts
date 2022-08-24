import getIPFSLink from './getIPFSLink';
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
        `https://avatar.tobi.sh/${profile?.ownedBy}_${profile?.handle}.png`
    ),
    'avatar'
  );
};

export default getAvatar;
