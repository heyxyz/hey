import type { Address } from 'viem';

import { useConversations } from '@xmtp/react-sdk';
import { type FC } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useMessagesStore } from 'src/store/non-persisted/useMessagesStore';

import User from './User';

const Conversations: FC = () => {
  const { setSelectedConversation } = useMessagesStore();
  const { conversations } = useConversations();

  return (
    <div className="h-[85vh]">
      <Virtuoso
        computeItemKey={(_, conversation) =>
          `${conversation.id}-${conversation.peerAddress}`
        }
        data={conversations}
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
