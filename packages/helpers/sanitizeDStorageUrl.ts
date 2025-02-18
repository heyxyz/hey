import { STORAGE_NODE_URL } from "@hey/data/constants";

/**
 * Returns the storage node link for a given hash.
 *
 * @param hash The storage node hash.
 * @returns The storage node link.
 */
const sanitizeDStorageUrl = (hash?: string): string => {
  if (!hash) {
    return "";
  }

  return hash.replace("lens://", STORAGE_NODE_URL);
};

export default sanitizeDStorageUrl;
