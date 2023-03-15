import { HANDLE_SUFFIX, LENSPROTOCOL_HANDLE } from 'data/constants';

/**
 *
 * @param handle - Complete handle
 * @param keepSuffix - Keep .lens or .test suffix
 * @returns formatted handle without .lens or .test suffix
 */
const formatHandle = (handle: string | null, keepSuffix = false): string => {
  if (!handle) {
    return '';
  }

  if (handle?.toLowerCase() === LENSPROTOCOL_HANDLE) {
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
