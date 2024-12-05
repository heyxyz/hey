import { AVATAR } from "@hey/data/constants";
import getLennyURL from "./getLennyURL";
import imageKit from "./imageKit";
import sanitizeDStorageUrl from "./sanitizeDStorageUrl";

/**
 * Returns the avatar image URL for a given profile.
 *
 * @param profile The profile object.
 * @param namedTransform The named transform to use.
 * @returns The avatar image URL.
 */
const getAvatar = (account: any, namedTransform = AVATAR): string => {
  const avatarUrl = account?.metadata?.picture || getLennyURL(account.address);

  return imageKit(sanitizeDStorageUrl(avatarUrl), namedTransform);
};

export default getAvatar;
