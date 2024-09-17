import { Regex } from "@hey/data/regex";

/**
 * Remove restricted symbols from profile name
 *
 * @param name Profile name
 * @returns Profile name with restricted symbols removed
 */
const sanitizeDisplayName = (
  name: null | string | undefined
): null | string => {
  if (!name) {
    return null;
  }

  return name.replace(Regex.profileNameFilter, " ").trim();
};

export default sanitizeDisplayName;
