import { HANDLE_SUFFIX, LENSPROTOCOL_HANDLE } from 'data';

/**
 * Format the given handle by removing the .lens or .test suffix.
 *
 * @param handle - Complete handle
 * @param keepSuffix - Keep .lens or .test suffix
 * @returns Formatted handle without .lens or .test suffix
 */
const formatHandle = (handle: string | null, keepSuffix = false): string => {
  if (!handle) {
    return '';
  }

  if (handle.toLowerCase() === LENSPROTOCOL_HANDLE) {
    return handle;
  }

  if (keepSuffix) {
    return handle.replace(HANDLE_SUFFIX, '') + HANDLE_SUFFIX;
  }

  return handle.replace(HANDLE_SUFFIX, '');
};

export default formatHandle;
