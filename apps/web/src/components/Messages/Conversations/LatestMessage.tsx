import type { CachedConversation } from "@xmtp/react-sdk";
import type { FC, ReactNode } from "react";

import { ContentTypeText } from "@xmtp/content-type-text";
import { useLastMessage } from "@xmtp/react-sdk";

const Wrapper: FC<{
  children: ReactNode;
}> = ({ children }) => (
  <div className="ld-text-gray-500 max-w-60 truncate text-sm">{children}</div>
);

interface LatestMessageProps {
  conversation: CachedConversation;
}

const LatestMessage: FC<LatestMessageProps> = ({ conversation }) => {
  const lastMessage = useLastMessage(conversation.topic);

  if (!lastMessage?.content) {
    return null;
  }

  if (lastMessage.contentType === ContentTypeText.toString()) {
    return <Wrapper>{lastMessage?.content}</Wrapper>;
  }

  return <Wrapper>Unknown</Wrapper>;
};

export default LatestMessage;
