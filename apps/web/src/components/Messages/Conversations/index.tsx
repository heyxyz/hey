import type { CachedConversation } from '@xmtp/react-sdk';
import type { FC } from 'react';

import cn from '@hey/ui/cn';
import { useClient, useConversations } from '@xmtp/react-sdk';
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
  const [visibleConversations, setVisibleConversations] = useState<
    CachedConversation[]
  >([]);
  const [page, setPage] = useState(1);

  const { client } = useClient();
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
