import type { NextPage } from 'next';
import type { Address } from 'viem';

import MetaTags from '@components/Common/MetaTags';
import { InboxIcon } from '@heroicons/react/24/outline';
import { APP_NAME } from '@hey/data/constants';
import { EmptyState } from '@hey/ui';
import cn from '@hey/ui/cn';
import { loadKeys, storeKeys } from '@lib/xmtp/keys';
import { Client, useClient } from '@xmtp/react-sdk';
import { ethers, providers } from 'ethers';
import { useEffect } from 'react';
import { useMessagesStore } from 'src/store/non-persisted/useMessagesStore';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import { useAccount } from 'wagmi';

import Conversations from './Conversations';
import MessagesList from './MessagesList';

const Messages: NextPage = () => {
  const { staffMode } = useFeatureFlagsStore();
  const { selectedConversation } = useMessagesStore();
  const { initialize, isLoading } = useClient();
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
    <div className="container mx-auto max-w-screen-xl grow px-0 sm:px-5">
      <div className="grid grid-cols-11">
        <MetaTags title={`Messages • ${APP_NAME}`} />
        <div
          className={cn(
            staffMode ? 'h-[92vh] max-h-[92vh]' : 'h-[94.5vh] max-h-[94.5vh]',
            'col-span-11 border-x bg-white md:col-span-11 lg:col-span-4'
          )}
        >
          {isLoading ? 'Loading XMTP...' : <Conversations />}
        </div>
        <div
          className={cn(
            staffMode ? 'h-[92vh] max-h-[92vh]' : 'h-[94.5vh] max-h-[94.5vh]',
            'col-span-11 border-r bg-white md:col-span-11 lg:col-span-7'
          )}
        >
          {selectedConversation ? (
            <MessagesList />
          ) : (
            <div className="flex h-full items-center justify-center">
              <EmptyState
                hideCard
                icon={<InboxIcon className="size-8" />}
                message="Select a conversation to start messaging"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
