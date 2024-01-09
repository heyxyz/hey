import type { IMessageIPFSWithCID } from '@pushprotocol/restapi';
import type { VirtuosoHandle } from 'react-virtuoso';

import Loader from '@components/Shared/Loader';
import { MessageType } from '@pushprotocol/restapi/src/lib/constants';
import React, { useEffect, useMemo, useRef } from 'react';
import { Virtuoso } from 'react-virtuoso';
import usePushHooks, { MAX_CHAT_ITEMS } from 'src/hooks/messaging/push/usePush';
import { usePushChatStore } from 'src/store/persisted/usePushChatStore';

import {
  getMessageReactions,
  getPrimaryMessage,
  getReplyMessage
} from '../helper';
import Message from './Card';
import InitialConversation from './InitialConversation';

interface MessageBodyProps {
  selectedChat: IMessageIPFSWithCID[];
}

const Messages = ({ selectedChat }: MessageBodyProps) => {
  const { useGetChatHistory } = usePushHooks();
  const listInnerRef = useRef<VirtuosoHandle>(null);
  const requestsFeed = usePushChatStore((state) => state.requestsFeed);
  const recepientProfie = usePushChatStore((state) => state.recipientProfile);
  const setRecipientChat = usePushChatStore((state) => state.setRecipientChat);
  const recipientChats = usePushChatStore((state) => state.recipientChats);

  const existingCIDs = useMemo(
    () => new Set(recipientChats.map((msg) => msg.cid)),
    [recipientChats]
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetChatHistory();

  const approvalRequired = useMemo(
    () => requestsFeed?.find((item) => item.did.includes(recepientProfie?.id!)),
    [requestsFeed, recepientProfie?.id]
  );

  const reactions = useMemo(
    () =>
      selectedChat.filter((chat) => chat.messageType === MessageType.REACTION),
    [selectedChat]
  );

  const userChats = useMemo(
    () =>
      selectedChat
        .filter((chat) => chat.messageType !== MessageType.REACTION)
        .sort((a, b) => a?.timestamp! - b?.timestamp!),
    [selectedChat]
  );

  const fetchMore = async () => {
    if (hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
      return false;
    }
  };

  useEffect(() => {
    const uniqueMessages = data?.pages
      .flatMap((page) => page)
      .filter((msg) => !existingCIDs.has(msg.cid));
    if (typeof uniqueMessages !== 'undefined' && uniqueMessages.length > 0) {
      setRecipientChat(uniqueMessages);
    }
  }, [data?.pages]);

  return (
    <>
      <Virtuoso
        className="relative m-3 flex h-full flex-grow flex-col overflow-auto overflow-y-scroll"
        components={{
          Header: () => {
            return hasNextPage && isFetchingNextPage ? (
              <div className="flex h-full items-center justify-center">
                <Loader message="Loading more messages..." />
              </div>
            ) : null;
          }
        }}
        data={userChats}
        firstItemIndex={
          userChats.length - MAX_CHAT_ITEMS < 0
            ? 100
            : userChats.length - MAX_CHAT_ITEMS
        }
        id="messages-list"
        initialTopMostItemIndex={userChats.length - 1}
        itemContent={(_index, message) => {
          const messageReactions = getMessageReactions(message, reactions);
          const primaryMessage = getPrimaryMessage(message);
          const replyMessage = getReplyMessage(message, userChats);

          return (
            <Message
              key={message.link}
              message={primaryMessage}
              messageReactions={messageReactions}
              replyMessage={replyMessage}
            />
          );
        }}
        overscan={{
          main: 200,
          reverse: 200
        }}
        ref={listInnerRef}
        startReached={fetchMore}
      />
      {approvalRequired ? (
        <InitialConversation message={approvalRequired} />
      ) : null}
    </>
  );
};

export default Messages;
