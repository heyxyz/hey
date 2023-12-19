import Loader from '@components/Shared/Loader';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { PUSH_ENV } from '@hey/data/constants';
import formatAddress from '@hey/lib/formatAddress';
import { Button, Spinner } from '@hey/ui';
import { getTwitterFormat } from '@lib/formatTime';
import { chat } from '@pushprotocol/restapi';
import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import useMessageStore from 'src/store/persisted/useMessageStore';
import { useWalletClient } from 'wagmi';

import ChatReactionPopover from './ChatReactionPopover';
import ChatMessageInput from './Input';

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
  const { address } = profile;

  const pgpPvtKey = useMessageStore((state) => state.pgpPvtKey);
  const { data: signer } = useWalletClient();

  const ref = useRef<HTMLTextAreaElement | null>(null);
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
    data: messages,
    isLoading: messagesLoading,
    refetch: refetchMessages
  } = useQuery({
    enabled: !!address,
    queryFn: async () => {
      if (!address) {
        return [];
      }
      if (!profile.threadhash) {
        return [];
      }

      const { threadHash } = await chat.conversationHash({
        account: baseConfig.account,
        conversationId: profile.address,
        env: PUSH_ENV
      });

      if (!threadHash) {
        return [];
      }

      const history =
        (await chat.history({
          ...baseConfig,
          limit: 10,
          threadhash: threadHash,
          toDecrypt: true
        })) ?? [];
      return history.reverse();
    },
    queryKey: ['get-messages', profile.did]
  });

  const { isPending: sendingMessage, mutateAsync: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      if (!signer) {
        return;
      }

      if (ref.current) {
        ref.current.value = '';
      }

      return await chat.send({
        account: signer?.account.address ?? '',
        env: PUSH_ENV,
        message: { content: message, type: 'Text' },
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

  const onSendMessage = useCallback(
    async (message: string) => {
      if (!message) {
        return;
      }
      await sendMessage({ message });
      await refetchMessages();
    },
    [refetchMessages, sendMessage]
  );

  useEffect(() => {
    // Scroll to the latest messages
    if (
      !messagesLoading &&
      messages?.length !== 0 &&
      messageContainerref.current
    ) {
      messageContainerref.current.scrollTop =
        messageContainerref.current.scrollHeight;
    }
  }, [messages, messagesLoading, messageContainerref]);

  return (
    <div className="flex h-[50rem] max-h-screen w-full flex-col justify-between">
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
        className="h-screen space-y-3 overflow-y-scroll px-4 py-2"
        ref={messageContainerref}
      >
        {messagesLoading && (
          <div className="flex h-full items-center justify-center">
            <Loader message="Loading messages..." />
          </div>
        )}
        {messages?.map((message) => {
          const messageFrom = message?.fromDID?.split?.(':')?.pop() ?? '';
          const isMessageFromProfile = messageFrom !== profile.address;
          if (!message.messageObj) {
            return '';
          }

          return (
            <div
              className={`group flex items-center gap-2 ${
                isMessageFromProfile ? 'flex-row-reverse' : 'flex-row'
              }`}
              key={message.link}
            >
              <div
                className={
                  isMessageFromProfile
                    ? 'text-wrap max-w-[75%] rounded-2xl rounded-br-sm bg-[#EF4444] px-4 py-2 text-white'
                    : 'text-wrap max-w-[75%] rounded-2xl rounded-bl-sm bg-gray-300 px-4 py-2'
                }
              >
                {typeof message.messageObj === 'string'
                  ? message.messageObj
                  : message.messageObj?.content.toString()}
                {message.timestamp && (
                  <sub className="ml-4 text-right text-xs">
                    {getTwitterFormat(dayjs(message.timestamp).toDate())}
                  </sub>
                )}
              </div>
              <div className="hidden group-hover:block">
                <ChatReactionPopover />
              </div>
            </div>
          );
        })}
      </div>
      <ChatMessageInput
        disabled={profile.isRequestProfile}
        inputRef={ref}
        onSend={onSendMessage}
        sending={sendingMessage}
      />
    </div>
  );
};

export default ChatListItemContainer;
