import { PROFILE_NAME_FILTER_REGEX } from 'data';

/**
 * Remove restricted symbols from profile name
 *
 * @param name Profile name
 * @returns Profile name with restricted symbols removed
 */
const sanitizeDisplayName = (
  name: string | null | undefined
): string | null => {
  if (!name) {
    return null;
  }
  return name.replace(PROFILE_NAME_FILTER_REGEX, ' ');
};

export default sanitizeDisplayName;
