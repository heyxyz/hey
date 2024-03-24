import type { CachedConversation } from '@xmtp/react-sdk';
import type { FC } from 'react';
import type { Address } from 'viem';

import { useConversations } from '@xmtp/react-sdk';
import { useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useMessagesStore } from 'src/store/non-persisted/useMessagesStore';

import User from './User';

const Conversations: FC = () => {
  const { setSelectedConversation } = useMessagesStore();
  const { conversations } = useConversations();
  const [visibleConversations, setVisibleConversations] = useState<
    CachedConversation[]
  >([]);
  const [page, setPage] = useState(1);
  const conversationsPerPage = 20;

  useEffect(() => {
    const end = page * conversationsPerPage;
    const newConversations = conversations.slice(0, end);
    setVisibleConversations(newConversations);
  }, [page, conversations]);

  return (
    <div className="h-[85vh]">
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
              className="cursor-pointer px-5 py-3"
              onClick={() => setSelectedConversation(conversation)}
            >
              <User
                address={conversation.peerAddress as Address}
                conversation={conversation}
              />
            </div>
          );
        }}
      />
    </div>
  );
};

export default Conversations;
