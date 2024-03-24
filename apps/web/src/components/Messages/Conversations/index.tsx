import type { CachedConversation } from '@xmtp/react-sdk';
import type { FC } from 'react';

import { ArrowLeftIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import cn from '@hey/ui/cn';
import { useClient, useConsent, useConversations } from '@xmtp/react-sdk';
import { useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';

import Conversation from './Conversation';
import EnableMessages from './EnableMessages';
import NewConversation from './NewConversation';
import ConversationsShimmer from './Shimmer';

interface ConversationsProps {
  isClientLoading: boolean;
}

const Conversations: FC<ConversationsProps> = ({ isClientLoading }) => {
  const { staffMode } = useFeatureFlagsStore();
  const [activeTab, setActiveTab] = useState<'messages' | 'requests'>(
    'messages'
  );
  const [requestsCount, setRequestsCount] = useState(0);
  const [filteredConversations, setFilteredConversations] = useState<
    CachedConversation[]
  >([]);
  const [visibleConversations, setVisibleConversations] = useState<
    CachedConversation[]
  >([]);
  const [page, setPage] = useState(1);

  const { client } = useClient();
  const { conversations, isLoading } = useConversations();
  const { consentState, isAllowed } = useConsent();
  const conversationsPerPage = 20;

  const getActiveConversations = async () => {
    const active = await Promise.all(
      conversations.map(async (conversation) => {
        if (
          activeTab === 'messages' &&
          (await isAllowed(conversation.peerAddress))
        ) {
          return conversation;
        }

        if (
          activeTab === 'requests' &&
          (await consentState(conversation.peerAddress)) === 'unknown'
        ) {
          return conversation;
        }

        return null;
      })
    );

    setRequestsCount(active.filter((c) => !c).length);
    setFilteredConversations(active.filter(Boolean) as CachedConversation[]);
  };

  useEffect(() => {
    getActiveConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, conversations]);

  useEffect(() => {
    const end = page * conversationsPerPage;
    const newConversations = filteredConversations.slice(0, end);
    setVisibleConversations(newConversations);
  }, [page, filteredConversations]);

  return (
    <div>
      <NewConversation />
      <div className="divider" />
      <button
        className={cn(
          { 'bg-gray-100 dark:bg-gray-800': activeTab === 'requests' },
          'hover:bg-gray-100 hover:dark:bg-gray-800',
          'flex w-full items-center space-x-3 px-5 py-3'
        )}
        onClick={() =>
          setActiveTab(activeTab === 'messages' ? 'requests' : 'messages')
        }
      >
        <div className="flex size-11 items-center justify-center rounded-full border dark:border-gray-700">
          {activeTab === 'messages' ? (
            <EnvelopeIcon className="size-5" />
          ) : (
            <ArrowLeftIcon className="size-5" />
          )}
        </div>
        <div className="flex flex-col items-start space-y-1">
          <div className="font-bold">
            {activeTab === 'messages' ? 'Message Requests' : 'Messages'}
          </div>
          <div className="ld-text-gray-500 text-sm">
            {requestsCount}{' '}
            {activeTab === 'messages' ? 'new requests' : 'messages'}
          </div>
        </div>
      </button>
      <div
        className={cn(
          staffMode ? 'h-[80vh] max-h-[80vh]' : 'h-[82.5vh] max-h-[82.5vh]'
        )}
      >
        {isClientLoading || isLoading ? (
          <ConversationsShimmer />
        ) : !client?.address ? (
          <EnableMessages />
        ) : (
          <Virtuoso
            computeItemKey={(_, conversation) =>
              `${conversation.id}-${conversation.peerAddress}`
            }
            data={visibleConversations}
            endReached={() => {
              setTimeout(() => {
                setPage((prevPage) => prevPage + 1);
              }, 1000);
            }}
            itemContent={(_, conversation) => {
              return <Conversation conversation={conversation} />;
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Conversations;
