import { AVATAR, DEFAULT_AVATAR } from "@hey/data/constants";
import imageKit from "./imageKit";
import sanitizeDStorageUrl from "./sanitizeDStorageUrl";

/**
 * Returns the avatar image URL for a given account or group.
 *
 * @param entity The account or group object.
 * @param namedTransform The named transform to use.
 * @returns The avatar image URL.
 */
const getAvatar = (entity: any, namedTransform = AVATAR): string => {
  if (!entity) {
    return DEFAULT_AVATAR;
  }

  const avatarUrl =
    entity?.metadata?.picture || entity?.metadata?.icon || DEFAULT_AVATAR;

  return imageKit(sanitizeDStorageUrl(avatarUrl), namedTransform);
};

export default getAvatar;
