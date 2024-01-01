import type {
  IMessageIPFS,
  IMessageIPFSWithCID,
  MessageObj
} from '@pushprotocol/restapi';

import { MessageType } from '@pushprotocol/restapi/src/lib/constants';
import React, { useMemo, useRef } from 'react';
import { usePushChatStore } from 'src/store/persisted/usePushChatStore';

import type { MessageReactions } from '../Actions/Reactions';

import Message from './Card';
import InitialConversation from './InitialConversation';

interface MessageBodyProps {
  selectedChat: IMessageIPFS[];
}

const Messages = ({ selectedChat }: MessageBodyProps) => {
  const listInnerRef = useRef<HTMLDivElement>(null);
  const requestsFeed = usePushChatStore((state) => state.requestsFeed);
  const recepientProfie = usePushChatStore((state) => state.recipientProfile);

  const approvalRequired = requestsFeed?.find((item) =>
    item.did.includes(recepientProfie?.id)
  );

  const reactions = selectedChat.filter(
    (chat) => chat.messageType === MessageType.REACTION
  );

  const userChats = useMemo(
    () =>
      selectedChat.filter((chat) => chat.messageType !== MessageType.REACTION),
    [selectedChat]
  );

  function transformReplyToMessage(reply: IMessageIPFS): IMessageIPFS {
    if (reply.messageType !== MessageType.REPLY) {
      return reply;
    }

    // @ts-expect-error
    const messageInner = reply?.messageObj?.content as {
      messageObj: MessageObj;
      messageType: MessageType;
    };

    return {
      ...reply,
      messageObj: {
        content: messageInner?.messageObj?.content as string
      },
      messageType: messageInner?.messageType
    };
  }

  const getMessageReactions = (chat: IMessageIPFS): MessageReactions[] => {
    return reactions
      .filter(
        (reaction) =>
          // @ts-expect-error
          reaction.messageObj?.reference === (chat as IMessageIPFSWithCID).cid
      )
      .map((item) =>
        typeof item.messageObj === 'string'
          ? item.messageObj
          : (item.messageObj?.content as string)
      ) as MessageReactions[];
  };

  const getPrimaryMessage = (chat: IMessageIPFS): IMessageIPFS => {
    const isReplyMessage = chat.messageType === MessageType.REPLY;
    return isReplyMessage ? transformReplyToMessage(chat) : chat;
  };

  const getReplyMessage = (chat: IMessageIPFS): IMessageIPFS | null => {
    const isReplyMessage = chat.messageType === MessageType.REPLY;
    const replyMessage = selectedChat.find(
      (message) =>
        // @ts-expect-error
        (message as IMessageIPFSWithCID).cid === chat.messageObj?.reference
    );
    return isReplyMessage ? transformReplyToMessage(replyMessage!) : null;
  };

  return (
    <section
      className="relative flex h-full flex-grow flex-col overflow-auto overflow-y-scroll p-3 pb-3"
      id="messages-list"
      ref={listInnerRef}
    >
      {userChats.map((message) => {
        const messageReactions = getMessageReactions(message);
        const primaryMessage = getPrimaryMessage(message);
        const replyMessage = getReplyMessage(message);

        return (
          <Message
            key={message.link}
            message={primaryMessage}
            messageReactions={messageReactions}
            replyMessage={replyMessage}
          />
        );
      })}

      {approvalRequired && <InitialConversation message={approvalRequired} />}
    </section>
  );
};

export default Messages;
