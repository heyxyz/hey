// import type { SignerType } from '@pushprotocol/restapi';
// import * as PushAPI from '@pushprotocol/restapi';
// import { ENV } from '@pushprotocol/restapi/src/lib/constants';
import { useEffect, useState } from 'react';
// import getIsDecryptedKeysAvailable from 'src/lib/isDecryptedKeys';
import { useAppStore } from 'src/store/app';
// import { useSigner } from 'wagmi';

const usePushAuth = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  // const decryptedKeysLocal = getIsDecryptedKeysAvailable();
  // const { data: signer } = useSigner();
  // const [decryptedKeys, setDecryptedKeys] = useState<string | null>(decryptedKeysLocal);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (!currentProfile) {
      return;
    }

    // const { ownedBy } = currentProfile;
    const checkIsPushUser = async () => {
      try {
        // const user = await PushAPI.user.get({
        //   account: ownedBy,
        //   env: ENV.STAGING
        // });
        // if (user) {
        //   const { encryptedPrivateKey } = user;
        //   const decryptedKeys = await PushAPI.chat.decryptPGPKey({
        //     encryptedPGPPrivateKey: encryptedPrivateKey,
        //     signer: signer as SignerType,
        //     env: ENV.STAGING
        //   });
        //   localStorage.setItem('pushDecryptedKeys', decryptedKeys);
        //   setDecryptedKeys(decryptedKeys);
        // } else {
        //   const createUser = await PushAPI.user.create({
        //     account: ownedBy,
        //     signer: signer as SignerType,
        //     env: ENV.STAGING
        //   });
        //   const { encryptedPrivateKey } = createUser;
        //   const decryptedKeys = await PushAPI.chat.decryptPGPKey({
        //     encryptedPGPPrivateKey: encryptedPrivateKey,
        //     signer: signer as SignerType,
        //     env: ENV.STAGING,
        //     toUpgrade: true
        //   });
        //   localStorage.setItem('pushDecryptedKeys', decryptedKeys);
        //   setDecryptedKeys(decryptedKeys);
        // }
      } catch (error) {
        setIsError(true);
        throw error;
      }
    };
    checkIsPushUser();
  }, [currentProfile]);

  return {
    // decryptedKeys,
    isError
  };
};

export default usePushAuth;
