import type { CachedConversation } from '@xmtp/react-sdk';
import type { FC } from 'react';

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
      <div
        className={cn(
          staffMode ? 'h-[86vh] max-h-[86vh]' : 'h-[88.5vh] max-h-[88.5vh]'
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
            data={filteredConversations}
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
