import type { Address } from 'viem';

import { useConversations } from '@xmtp/react-sdk';
import { type FC } from 'react';
import { useMessagesStore } from 'src/store/non-persisted/useMessagesStore';

import User from './User';

const Conversations: FC = () => {
  const { setSelectedConversation } = useMessagesStore();
  const { conversations } = useConversations();

  return (
    <div className="space-y-5">
      {conversations.map((conversation) => (
        <div
          className="cursor-pointer"
          key={conversation.id}
          onClick={() => setSelectedConversation(conversation)}
        >
          <User
            address={conversation.peerAddress as Address}
            conversation={conversation}
          />
        </div>
      ))}
    </div>
  );
};

export default Conversations;
