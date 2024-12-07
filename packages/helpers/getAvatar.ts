import { AVATAR, IPFS_GATEWAY } from "@hey/data/constants";
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
  const avatarUrl =
    account?.metadata?.picture ||
    `${IPFS_GATEWAY}/Qmb4XppdMDCsS7KCL8nCJo8pukEWeqL4bTghURYwYiG83i/cropped_image.png`;

  return imageKit(sanitizeDStorageUrl(avatarUrl), namedTransform);
};

export default getAvatar;
