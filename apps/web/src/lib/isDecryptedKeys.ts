/**
 * Checks if the PUSH decrypted Keys are available in local storage
 *
 * @returns Decrypted keys as string if it's present otherwise null
 */
const getIsDecryptedKeysAvailable = () => {
  const pushDecryptedKeys = localStorage.getItem('pushDecryptedKeys');
  if (pushDecryptedKeys) {
    return pushDecryptedKeys;
  }
  return null;
};

export default getIsDecryptedKeysAvailable;
