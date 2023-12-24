import type { DisplayedMessage } from '@lib/mapReactionsToMessages';
import type { IMessageIPFSWithCID, Message } from '@pushprotocol/restapi';

import Loader from '@components/Shared/Loader';
import {
  ArrowUturnLeftIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { PUSH_ENV } from '@hey/data/constants';
import formatAddress from '@hey/lib/formatAddress';
import { Button, Spinner } from '@hey/ui';
import { transformMessages } from '@lib/mapReactionsToMessages';
import { chat } from '@pushprotocol/restapi';
import { MessageType } from '@pushprotocol/restapi/src/lib/constants';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { formatRelative } from 'date-fns';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import useMessageStore from 'src/store/persisted/useMessageStore';
import { useWalletClient } from 'wagmi';

import ChatReactionPopover from './ChatReactionPopover';
import ChatMessageInput from './Input';
import RenderMessage from './RenderMessage';
import RenderReplyMessage from './RenderReplyMessage';

const ChatListItemContainer = ({
  profile
}: {
  profile: {
    address: string;
    did: string;
    isRequestProfile: boolean;
    name: string;
    threadhash?: string;
  };
}) => {
  const ITEM_LIMIT = 30;
  const { address, threadhash } = profile;

  const pgpPvtKey = useMessageStore((state) => state.pgpPvtKey);
  const { data: signer } = useWalletClient();

  const messageContainerref = useRef<HTMLDivElement | null>(null);

  const baseConfig = useMemo(() => {
    return {
      account: signer?.account.address ?? '',
      env: PUSH_ENV,
      pgpPrivateKey: pgpPvtKey,
      threadhash: profile.threadhash ?? ''
    };
  }, [signer?.account.address, pgpPvtKey, profile.threadhash]);

  const {
    data: historyData,
    fetchNextPage,
    hasNextPage,
    isFetching: isHistoryFetching,
    isFetchingNextPage,
    isLoading: isHistoryLoading
  } = useInfiniteQuery({
    enabled: !!address && !!threadhash,
    getNextPageParam: (nextPage: IMessageIPFSWithCID[]) => nextPage?.[0]?.link,
    getPreviousPageParam: (firstPage: IMessageIPFSWithCID[]) =>
      firstPage.pop()?.link,
    initialPageParam: threadhash ?? '',
    queryFn: async ({ pageParam }: { pageParam: string }) => {
      if (!pageParam) {
        return [];
      }
      const history =
        ((await chat.history({
          ...baseConfig,
          limit: ITEM_LIMIT,
          threadhash: pageParam,
          toDecrypt: true
        })) as unknown as IMessageIPFSWithCID[]) ?? [];

      return history;
      // return transformMessages(history);
    },
    queryKey: ['fetch-messages', profile.did]
  });

  const isMessagesLoading = isHistoryFetching && !isHistoryLoading;
  const messages = transformMessages(
    historyData?.pages.flatMap((page) => [...page]) ?? []
  );

  console.log('>>> messages', messages);

  const { isPending: sendingMessage, mutateAsync: sendMessage } = useMutation({
    mutationFn: async (message: Message) => {
      if (!signer) {
        return;
      }

      if (!message) {
        return;
      }

      return await chat.send({
        account: signer?.account.address ?? '',
        env: PUSH_ENV,
        message: message,
        pgpPrivateKey: pgpPvtKey,
        signer: signer,
        to: profile.address
      });
    },
    mutationKey: ['send-message']
  });

  const { isPending: isApproving, mutateAsync: onApprove } = useMutation({
    mutationFn: async (did: string) => {
      return true;
    },
    mutationKey: ['approve-user']
  });

  const { isPending: isRejecting, mutateAsync: onReject } = useMutation({
    mutationFn: async (did: string) => {
      return true;
    },
    mutationKey: ['approve-user']
  });

  const [replyMessage, setReplyMessage] = useState<DisplayedMessage | null>(
    null
  );

  const onSendMessage = useCallback(
    async (message: string) => {
      if (!message) {
        return;
      }
      if (!replyMessage) {
        await sendMessage({ content: message, type: 'Text' });
      } else {
        await sendMessage({
          content: { content: message, type: 'Text' },
          reference: replyMessage.link,
          type: 'Reply'
        });
      }
      setReplyMessage(null);
    },
    [replyMessage, sendMessage]
  );

  const onSendAttachment = useCallback(
    async (file: File) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async (event) => {
        const result = event.target?.result;
        if (!result || typeof result !== 'string') {
          return;
        }
        await sendMessage({ content: result, type: 'Image' });
      };
    },
    [sendMessage]
  );

  const onRemoveReplyMessage = useCallback(() => {
    setReplyMessage(null);
  }, []);

  useEffect(() => {
    // Scroll to the latest messages
    if (
      !isMessagesLoading &&
      messages?.length !== 0 &&
      messageContainerref.current
    ) {
      messageContainerref.current.scrollTop =
        messageContainerref.current.scrollHeight;
    }
  }, [messages, isMessagesLoading, messageContainerref]);

  return (
    <div className="flex h-[-webkit-calc(100vh-5.5rem)] max-h-screen w-full flex-col justify-between">
      <div className="m-4 flex items-center justify-between bg-white">
        <span>
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            {profile.name ?? formatAddress(profile.address)}
          </h3>
          <p className="mt-1 text-sm text-gray-500">last seen at 03:43</p>
        </span>
        <InformationCircleIcon
          aria-hidden="true"
          className="h-5 w-5 text-[#EF4444]"
        />
      </div>
      {profile.isRequestProfile && (
        <div className="my-4 flex">
          <div>This user is not in your contacts, please reject or accept</div>
          <div className="ml-auto space-x-2">
            <Button
              icon={isApproving && <Spinner size="xs" />}
              onClick={() => onApprove(profile.did)}
            >
              Approve
            </Button>
            <Button
              icon={isRejecting && <Spinner size="xs" />}
              onClick={() => onReject(profile.did)}
            >
              Reject
            </Button>
          </div>
        </div>
      )}
      <div className="w-full border-b-[1px]" />
      <div
        className="h-screen overflow-y-scroll space-y-3 px-4 py-2"
        ref={messageContainerref}
      >
        {isMessagesLoading && !isFetchingNextPage && (
          <div className="flex h-full items-center justify-center">
            <Loader message="Loading messages..." />
          </div>
        )}

        <Virtuoso
          components={{
            Header: () => {
              if (hasNextPage && isFetchingNextPage) {
                return (
                  <div className="flex h-full items-center justify-center">
                    <Loader message="Loading messages..." />
                  </div>
                );
              }
            }
          }}
          data={messages}
          firstItemIndex={messages.length - 30}
          initialTopMostItemIndex={ITEM_LIMIT - 1}
          itemContent={(index, message) => {
            const isMessageFromProfile = message.from !== profile.address;
            if (!message.messageObj) {
              return '';
            }

            return (
              <div
                className={`group flex items-center gap-2 ${
                  isMessageFromProfile ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div className="max-w-[75%]">
                  <div
                    className={
                      isMessageFromProfile
                        ? 'text-wrap rounded-2xl rounded-br-sm bg-[#EF4444] px-4 py-2 items-center my-2 text-white'
                        : 'text-wrap rounded-2xl rounded-bl-sm bg-gray-300 px-4 py-2 my-2'
                    }
                  >
                    {message.messageType !== MessageType.REPLY && (
                      <RenderMessage key={message.link} message={message} />
                    )}
                    {message.messageType === MessageType.REPLY && (
                      <RenderReplyMessage message={message as unknown as any} />
                    )}
                    {message.timestamp && (
                      <sub className="ml-4 text-right text-xs">
                        {formatRelative(message.timestamp, new Date())}
                      </sub>
                    )}
                  </div>
                  {message.reactions && (
                    <div className="float-right -mt-2 flex gap-1">
                      {message.reactions.map((reaction, index) => (
                        <span
                          className="h-6 w-6 rounded-full bg-[#EF4444] bg-opacity-20 text-center"
                          key={index}
                        >
                          {reaction}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="hidden group-hover:block">
                  <ChatReactionPopover
                    reactions={message.reactions}
                    recipientAddress={profile.address}
                    reference={message.link}
                  />
                </div>
                <div
                  className="hidden cursor-pointer group-hover:block"
                  onClick={() => setReplyMessage(message)}
                  role="button"
                >
                  <ArrowUturnLeftIcon
                    aria-hidden="true"
                    className="h-5 w-5 opacity-100 transition duration-150 ease-in-out"
                  />
                </div>
              </div>
            );
          }}
          startReached={() => fetchNextPage()}
        />
      </div>
      <ChatMessageInput
        disabled={profile.isRequestProfile}
        onRemoveReplyMessage={onRemoveReplyMessage}
        onSend={(message) => onSendMessage(message)}
        onSendAttachment={onSendAttachment}
        replyMessage={replyMessage}
        sending={sendingMessage}
      />
    </div>
  );
};

export default ChatListItemContainer;
