import isFeatureEnabled from '@lib/isFeatureEnabled';
import { Client } from '@xmtp/xmtp-js';
import { useEffect } from 'react';
import { useAppStore } from 'src/store/app';
import { useMessageStore } from 'src/store/message';
import { useSigner } from 'wagmi';

const useXmtpClient = () => {
  const { data: signer } = useSigner();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const client = useMessageStore((state) => state.client);
  const setClient = useMessageStore((state) => state.setClient);
  const isMessagesEnabled = isFeatureEnabled('messages', currentProfile?.id);

  useEffect(() => {
    const initXmtpClient = async () => {
      if (signer && !client) {
        const xmtp = await Client.create(signer);
        setClient(xmtp);
      }
    };
    if (isMessagesEnabled) {
      initXmtpClient();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer]);

  return {
    client: client
  };
};

export default useXmtpClient;
