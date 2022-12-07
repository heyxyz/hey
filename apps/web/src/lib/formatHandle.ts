import { IS_MAINNET, LENSPROTOCOL_HANDLE } from 'data/constants';

const type = IS_MAINNET ? '.lens' : '.test';

/**
 *
 * @param handle - Complete handle
 * @returns formatted handle without .lens
 */
const formatHandle = (handle: string | null): string => {
  if (handle === LENSPROTOCOL_HANDLE) {
    return handle;
  }

  if (!handle) {
    return '';
  }

  if (handle.endsWith(type)) {
    return handle.replace(type, '');
  }

  return handle + type;
};

export default formatHandle;
