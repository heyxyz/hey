import { useUserSigNoncesQuery } from '@hey/lens';
import getCurrentSessionProfileId from '@lib/getCurrentSessionProfileId';
import { type FC } from 'react';
import { useNonceStore } from 'src/store/useNonceStore';

const LensNonceProvider: FC = () => {
  const currentSessionProfileId = getCurrentSessionProfileId();
  const setLensHubOnchainSigNonce = useNonceStore(
    (state) => state.setLensHubOnchainSigNonce
  );
  const setLensPublicActProxyOnchainSigNonce = useNonceStore(
    (state) => state.setLensPublicActProxyOnchainSigNonce
  );

  useUserSigNoncesQuery({
    onCompleted: (data) => {
      setLensHubOnchainSigNonce(data.userSigNonces.lensHubOnchainSigNonce);
      setLensPublicActProxyOnchainSigNonce(
        data.userSigNonces.lensPublicActProxyOnchainSigNonce
      );
    },
    skip: !currentSessionProfileId
  });

  return null;
};

export default LensNonceProvider;
