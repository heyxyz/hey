import { useUserSigNoncesQuery } from '@lenster/lens';
import type { FC } from 'react';
import { isSupported, share } from 'shared-zustand';
import { useAppPersistStore } from 'src/store/app';
import { useNonceStore } from 'src/store/nonce';

const UserSigNoncesProvider: FC = () => {
  const profileId = useAppPersistStore((state) => state.profileId);
  const setUserSigNonce = useNonceStore((state) => state.setUserSigNonce);

  if (isSupported()) {
    share('userSigNonce', useNonceStore);
  }

  // Sync nonce every 10 seconds
  useUserSigNoncesQuery({
    skip: !profileId,
    onCompleted: ({ userSigNonces }) => {
      setUserSigNonce(userSigNonces.lensHubOnChainSigNonce);
    },
    pollInterval: 10000
  });

  return null;
};

export default UserSigNoncesProvider;
