import { AVATAR, ZERO_ADDRESS } from 'data/constants';
import getIPFSLink from 'utils/getIPFSLink';
import getStampFyiURL from 'utils/getStampFyiURL';
import imageProxy from 'utils/imageProxy';

interface Profile {
  picture?: {
    original?: {
      url?: string;
    };
    uri?: string;
  };
  ownedBy?: string;
}

const SKIP_LIST = ['static-assets.lenster.xyz', 'avataaars.io', 'avatar.tobi.sh'];

/**
 *
 * @param profile Profile object
 * @param isCdn To passthrough image proxy
 * @returns avatar image url
 */
const getAvatar = (profile: Profile, isCdn = true): string => {
  const avatarUrl =
    profile?.picture?.original?.url ??
    profile?.picture?.uri ??
    getStampFyiURL(profile?.ownedBy ?? ZERO_ADDRESS);
  const url = new URL(avatarUrl);

  if (SKIP_LIST.includes(url.hostname)) {
    return avatarUrl;
  }

  return isCdn ? imageProxy(getIPFSLink(avatarUrl), AVATAR) : getIPFSLink(avatarUrl);
};

export default getAvatar;
