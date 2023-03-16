import { AVATAR, ZERO_ADDRESS } from 'data/constants';
import getIPFSLink from 'utils/getIPFSLink';
import getStampFyiURL from 'utils/getStampFyiURL';
import imageProxy from 'utils/imageProxy';

const skipList = [
  'static-assets.lenster.xyz',
  'avataaars.io',
  'avatar.tobi.sh',
  'media.giphy.com',
  'media1.giphy.com',
  'media2.giphy.com',
  'media3.giphy.com',
  'media4.giphy.com'
];

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

  return getIPFSLink(avatarUrl);
};

export default getAvatar;
