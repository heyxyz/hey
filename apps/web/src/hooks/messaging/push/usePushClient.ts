import { PushAPI } from '@pushprotocol/restapi';
import { ENV } from '@pushprotocol/restapi/src/lib/constants';
import { useEffect, useState } from 'react';
import { usePushChatStore } from 'src/store/persisted/usePushChatStore';
import { useWalletClient } from 'wagmi';

const usePushClient = () => {
  const { data: signer } = useWalletClient();
  const { pgpPassword } = usePushChatStore();
  const [client, setClient] = useState<null | PushAPI>(null);

  useEffect(() => {
    if (!signer) {
      return;
    }
    PushAPI.initialize(signer!, {
      env: ENV.DEV,
      versionMeta: {
        NFTPGP_V1: {
          password: pgpPassword!
        }
      }
    }).then((response) => {
      setClient(response);
    });
  }, [signer]);

  return client;
};

export default usePushClient;
