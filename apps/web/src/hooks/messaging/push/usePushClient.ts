import { PushAPI } from '@pushprotocol/restapi';
import { ENV } from '@pushprotocol/restapi/src/lib/constants';
import { useEffect, useState } from 'react';
import { useWalletClient } from 'wagmi';

const usePushClient = () => {
  const { data: signer } = useWalletClient();
  const [client, setClient] = useState<null | PushAPI>(null);

  useEffect(() => {
    if (!signer) {
      return;
    }
    PushAPI.initialize(signer!, { env: ENV.DEV }).then((response) => {
      setClient(response);
    });
  }, [signer]);

  return client;
};

export default usePushClient;
