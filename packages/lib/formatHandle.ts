import { HANDLE_PREFIX, LENSPROTOCOL_HANDLE } from '@lenster/data/constants';

/**
 * Format the given handle by conditionally removing or appending the .lens or .test suffix.
 *
 * @param handle Complete handle
 * @returns Formatted handle without lens/ or test/ prefix
 */
const formatHandle = (handle: string | null): string => {
  if (!handle) {
    return '';
  }

  if (handle.toLowerCase() === LENSPROTOCOL_HANDLE) {
    return handle;
  }

  return handle.replace(HANDLE_PREFIX, '');
};

export default formatHandle;
