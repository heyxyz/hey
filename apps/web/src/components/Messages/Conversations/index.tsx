import type { CachedConversation } from '@xmtp/react-sdk';
import type { FC } from 'react';
import type { Address } from 'viem';

import cn from '@hey/ui/cn';
import { useConversations } from '@xmtp/react-sdk';
import { useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useMessagesStore } from 'src/store/non-persisted/useMessagesStore';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';

import NewConversation from './NewConversation';
import ConversationsShimmer from './Shimmer';
import User from './User';

interface ConversationsProps {
  isClientLoading: boolean;
}

const Conversations: FC<ConversationsProps> = ({ isClientLoading }) => {
  const { staffMode } = useFeatureFlagsStore();
  const {
    selectedConversation,
    setNewConversationAddress,
    setSelectedConversation
  } = useMessagesStore();
  const [visibleConversations, setVisibleConversations] = useState<
    CachedConversation[]
  >([]);
  const [page, setPage] = useState(1);
  const { conversations, isLoading } = useConversations();
  const conversationsPerPage = 20;

  useEffect(() => {
    const end = page * conversationsPerPage;
    const newConversations = conversations.slice(0, end);
    setVisibleConversations(newConversations);
  }, [page, conversations]);

  return (
    <div>
      <NewConversation />
      <div className="divider" />
      <div
        className={cn(
          staffMode ? 'h-[86vh] max-h-[86vh]' : 'h-[88.5vh] max-h-[88.5vh]'
        )}
      >
        {isClientLoading || isLoading ? (
          <ConversationsShimmer />
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
              return (
                <div
                  className={cn(
                    {
                      'bg-gray-100 dark:bg-gray-800':
                        selectedConversation?.id === conversation.id
                    },
                    'cursor-pointer px-5 py-3'
                  )}
                  onClick={() => {
                    setNewConversationAddress(null);
                    setSelectedConversation(conversation);
                  }}
                >
                  <User
                    address={conversation.peerAddress as Address}
                    conversation={conversation}
                  />
                </div>
              );
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Conversations;
