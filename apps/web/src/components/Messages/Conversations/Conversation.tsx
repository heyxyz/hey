import { Leafwatch } from "@helpers/leafwatch";
import { MESSAGES } from "@hey/data/tracking";
import cn from "@hey/ui/cn";
import type { CachedConversation } from "@xmtp/react-sdk";
import type { FC } from "react";
import { useMessagesStore } from "src/store/non-persisted/useMessagesStore";
import type { Address } from "viem";
import User from "./User";

interface ConversationProps {
  conversation: CachedConversation;
}

const Conversation: FC<ConversationProps> = ({ conversation }) => {
  const {
    selectedConversation,
    setNewConversationAddress,
    setSelectedConversation
  } = useMessagesStore();

  return (
    <div
      className={cn(
        {
          "bg-gray-100 dark:bg-gray-800":
            selectedConversation?.topic === conversation.topic
        },
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        "cursor-pointer px-5 py-3"
      )}
      onClick={() => {
        setNewConversationAddress(null);
        setSelectedConversation(conversation);
        Leafwatch.track(MESSAGES.OPEN_CONVERSATION);
      }}
    >
      <User
        address={conversation.peerAddress as Address}
        conversation={conversation}
      />
    </div>
  );
};

export default Conversation;
