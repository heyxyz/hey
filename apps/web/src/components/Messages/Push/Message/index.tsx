import type { IMessageIPFSWithCID } from '@pushprotocol/restapi';
import type { VirtuosoHandle } from 'react-virtuoso';

import Loader from '@components/Shared/Loader';
import { MessageType } from '@pushprotocol/restapi/src/lib/constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useMemo, useRef } from 'react';
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
  const { getChatHistory } = usePushHooks();
  const listInnerRef = useRef<VirtuosoHandle>(null);
  const requestsFeed = usePushChatStore((state) => state.requestsFeed);
  const recepientProfie = usePushChatStore((state) => state.recipientProfile);
  const setRecipientChat = usePushChatStore((state) => state.setRecipientChat);
  const recepientProfile = usePushChatStore((state) => state.recipientProfile);
  const recipientChats = usePushChatStore((state) => state.recipientChats);

  const existingCIDs = new Set(recipientChats.map((msg) => msg.cid));

  const { fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    enabled: recepientProfile?.threadHash ? true : false,
    getNextPageParam: (lastPage) => {
      return lastPage.length < MAX_CHAT_ITEMS
        ? lastPage[lastPage.length - 1]?.cid
        : undefined;
    },
    getPreviousPageParam: (firstPage, allPages) => {
      const pageIndex = allPages.findIndex((page) => page === firstPage);
      if (pageIndex === -1 || pageIndex === 0) {
        return;
      }
      const previousPage = allPages[pageIndex - 1];
      return previousPage.length > 0 ? previousPage[0]?.cid : undefined;
    },
    initialPageParam: recepientProfile?.threadHash ?? '',
    queryFn: async ({ pageParam }: { pageParam: string }) => {
      if (!pageParam) {
        return [];
      }
      const history = await getChatHistory(pageParam);
      const uniqueMessages = history.filter(
        (msg) => !existingCIDs.has(msg.cid)
      );
      if (uniqueMessages.length > 0) {
        setRecipientChat(uniqueMessages);
      }
      return history;
    },
    queryKey: ['getChatHistory', recepientProfile?.id],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 604_800
  });

  const approvalRequired = requestsFeed?.find((item) =>
    item.did.includes(recepientProfie?.id!)
  );

  const reactions = selectedChat.filter(
    (chat) => chat.messageType === MessageType.REACTION
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

  return (
    <>
      <Virtuoso
        className="relative flex h-full flex-grow flex-col overflow-auto overflow-y-scroll p-3 pb-3"
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
