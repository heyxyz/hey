import { HANDLE_SUFFIX, LENSPROTOCOL_HANDLE } from '@lenster/data/constants';

/**
 * Format the given handle by conditionally removing or appending the .lens or .test suffix.
 *
 * @param handle Complete handle
 * @param keepSuffix Keep the .lens or .test suffix if true, remove if false
 * @returns Formatted handle without .lens or .test suffix, unless keepSuffix is true
 */
const formatHandle = (handle: string | null, keepSuffix = false): string => {
  if (!handle) {
    return '';
  }

  if (handle.toLowerCase() === LENSPROTOCOL_HANDLE) {
    return handle;
  }

  if (keepSuffix) {
    return handle.match(HANDLE_SUFFIX)
      ? handle.split(HANDLE_SUFFIX)[0] + HANDLE_SUFFIX
      : handle + HANDLE_SUFFIX;
  }

  return handle.replace(HANDLE_SUFFIX, '');
};

export default formatHandle;
