import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import { InboxIcon } from '@heroicons/react/24/outline';
import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { EmptyState } from '@hey/ui';
import cn from '@hey/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import { loadKeys } from '@lib/xmtp/keys';
import { useClient } from '@xmtp/react-sdk';
import { providers } from 'ethers';
import { useEffect } from 'react';
import { useMessagesStore } from 'src/store/non-persisted/useMessagesStore';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import { useAccount } from 'wagmi';

import StartConversation from './Composer/StartConversation';
import Conversations from './Conversations';
import MessagesList from './MessagesList';

const Messages: NextPage = () => {
  const { staffMode } = useFeatureFlagsStore();
  const { newConversationAddress, selectedConversation } = useMessagesStore();
  const { initialize, isLoading } = useClient();
  const { address } = useAccount();

  useEffect(() => {
    Leafwatch.track(PAGEVIEW, { page: 'messages' });
  }, []);

  const initXmtp = async () => {
    if (!address) {
      return;
    }

    const provider = new providers.Web3Provider(window?.ethereum);
    const signer = provider.getSigner(address);

    let keys = loadKeys(address);
    if (!keys) {
      return;
    }

    return await initialize({ keys, options: { env: 'production' }, signer });
  };

  useEffect(() => {
    initXmtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mx-auto max-w-screen-xl grow px-0 sm:px-5">
      <div className="grid grid-cols-11">
        <MetaTags title={`Messages • ${APP_NAME}`} />
        <div className="col-span-11 border-x bg-white md:col-span-11 lg:col-span-4 dark:border-gray-700 dark:bg-black">
          <Conversations isClientLoading={isLoading} />
        </div>
        <div className="col-span-11 border-r bg-white md:col-span-11 lg:col-span-7 dark:border-gray-700 dark:bg-black">
          {newConversationAddress ? (
            <StartConversation />
          ) : selectedConversation ? (
            <MessagesList />
          ) : (
            <div
              className={cn(
                staffMode ? 'h-[85vh] max-h-[85vh]' : 'h-[87vh] max-h-[87vh]',
                'flex h-full items-center justify-center'
              )}
            >
              <EmptyState
                hideCard
                icon={<InboxIcon className="size-10" />}
                message={
                  <b className="text-lg">
                    Select a conversation to start messaging
                  </b>
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
