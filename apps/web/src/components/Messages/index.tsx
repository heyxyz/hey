import type { NextPage } from 'next';
import type { Address } from 'viem';

import MetaTags from '@components/Common/MetaTags';
import { APP_NAME } from '@hey/data/constants';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { loadKeys, storeKeys } from '@lib/xmtp/keys';
import { Client, useClient } from '@xmtp/react-sdk';
import { ethers, providers } from 'ethers';
import { useEffect } from 'react';
import { useMessagesStore } from 'src/store/non-persisted/useMessagesStore';
import { useAccount } from 'wagmi';

import Conversations from './Conversations';
import MessagesList from './MessagesList';
import StartConversation from './MessagesList/Composer/StartConversation';

const Messages: NextPage = () => {
  const { initialize, isLoading } = useClient();
  const { selectedConversation } = useMessagesStore();
  const { address } = useAccount();

  const initXmtp = async () => {
    const provider = new providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(address);

    const xmtpAddress = await ethers.utils.getAddress(address as string);
    let keys = loadKeys(xmtpAddress as Address);
    if (!keys) {
      keys = await Client.getKeys(signer, { env: 'production' });
      storeKeys(xmtpAddress as Address, keys);
    }
    await initialize({ keys, options: { env: 'production' }, signer });
  };

  useEffect(() => {
    initXmtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GridLayout>
      <MetaTags title={`Messages • ${APP_NAME}`} />
      <GridItemFour>
        <Card>{isLoading ? 'Loading XMTP...' : <Conversations />}</Card>
      </GridItemFour>
      <GridItemEight>
        <Card>
          {selectedConversation ? <MessagesList /> : <StartConversation />}
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Messages;
