import { XMTP_ENV } from '@hey/data/constants';
import { useClient } from '@xmtp/react-sdk';
import { useEffect } from 'react';
import useProfileStore from 'src/store/persisted/useProfileStore';
import useXMTP from 'src/store/persisted/useXMTPKey';
import { useWalletClient } from 'wagmi';

export const useInitializedClient = () => {
  const { client, initialize, isLoading } = useClient();
  const { getKeys } = useXMTP();

  const currentProfile = useProfileStore((state) => state.currentProfile);

  const { data, status } = useWalletClient();

  useEffect(() => {
    if (!currentProfile) {
      return;
    }
    if (isLoading) {
      return;
    }
    if (!data || status !== 'success') {
      return;
    }

    const keys = getKeys();

    if (!keys) {
      return;
    }

    initialize({ keys, options: { env: XMTP_ENV }, signer: data });
    return () => {};
  }, [client, isLoading, data, status, getKeys, initialize, currentProfile]);

  return { client: client, isLoading };
};
