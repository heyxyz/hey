import { CursorArrowRaysIcon } from '@heroicons/react/24/outline';
import { MESSAGES } from '@hey/data/tracking';
import { Button, EmptyState } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { loadKeys, storeKeys } from '@lib/xmtp/keys';
import { Client, useClient } from '@xmtp/react-sdk';
import { providers } from 'ethers';
import { type FC, useState } from 'react';
import toast from 'react-hot-toast';
import { useAccount } from 'wagmi';

const EnableMessages: FC = () => {
  const { initialize } = useClient();
  const { address } = useAccount();
  const [initializeing, setInitializing] = useState(false);

  const initXmtp = async () => {
    if (!address) {
      return;
    }

    try {
      setInitializing(true);
      const provider = new providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(address);

      let keys = loadKeys(address);
      if (!keys) {
        keys = await Client.getKeys(signer, { env: 'production' });
        storeKeys(address, keys);
      }
      await initialize({ keys, options: { env: 'production' }, signer });
      Leafwatch.track(MESSAGES.ENABLE_MESSAGES);

      return toast.success('Messages enabled successfully');
    } finally {
      setInitializing(false);
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <EmptyState
        hideCard
        icon={<CursorArrowRaysIcon className="size-10" />}
        message="Enable Messages"
      />
      <Button disabled={initializeing} onClick={initXmtp}>
        Enable
      </Button>
    </div>
  );
};

export default EnableMessages;
