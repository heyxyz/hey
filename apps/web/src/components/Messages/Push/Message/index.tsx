import type { IMessageIPFS, IMessageIPFSWithCID } from '@pushprotocol/restapi';

import { MessageType } from '@pushprotocol/restapi/src/lib/constants';
import React, { useRef } from 'react';
import { usePushChatStore } from 'src/store/persisted/usePushChatStore';

import type { MessageReactions } from '../Actions/Reactions';

import Message from './Card';
import InitialConversation from './InitialConversation';

interface MessageBodyProps {
  selectedChat: IMessageIPFS[];
}

export default function Messages({ selectedChat }: MessageBodyProps) {
  const listInnerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const requestsFeed = usePushChatStore((state) => state.requestsFeed);
  const recepientProfie = usePushChatStore((state) => state.recipientProfile);

  const approvalRequired = requestsFeed?.find((item) =>
    item.did.includes(recepientProfie?.id)
  );

  const reactions = selectedChat.filter(
    (chat) => chat.messageType === MessageType.REACTION
  );
  const replies = selectedChat.filter(
    (chat) => chat.messageType === MessageType.REPLY
  );

  return (
    <section
      className="relative flex h-full flex-grow flex-col overflow-auto overflow-y-scroll p-3 pb-3"
      id="messages-list"
      ref={listInnerRef}
    >
      {selectedChat
        .filter((chat) => chat.messageType !== MessageType.REACTION)
        .map?.((chat) => {
          const messageReactions = reactions
            .filter(
              (reactionChat) =>
                reactionChat.link === (chat as IMessageIPFSWithCID).cid
            )
            .map((item) => item.messageContent) as MessageReactions[];

          const replyMessage = replies.find(
            (reactionChat) =>
              reactionChat.link === (chat as IMessageIPFSWithCID).cid
          );

          return (
            <Message
              key={chat.link}
              message={chat}
              messageReactions={messageReactions}
              replyMessage={replyMessage ?? null}
            />
          );
        })}
      <div ref={bottomRef} />

      {approvalRequired && <InitialConversation message={approvalRequired} />}
    </section>
  );
}
