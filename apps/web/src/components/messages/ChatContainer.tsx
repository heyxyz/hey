import type { DisplayedMessage } from '@lib/mapReactionsToMessages';
import type { IMessageIPFSWithCID, Message } from '@pushprotocol/restapi';

import Loader from '@components/Shared/Loader';
import {
  ArrowUturnLeftIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { PUSH_ENV } from '@hey/data/constants';
import formatAddress from '@hey/lib/formatAddress';
import { Button, Image, Spinner } from '@hey/ui';
import { transformMessages } from '@lib/mapReactionsToMessages';
import { chat } from '@pushprotocol/restapi';
import { MessageType } from '@pushprotocol/restapi/src/lib/constants';
import { useMutation, useQuery } from '@tanstack/react-query';
import { formatRelative } from 'date-fns';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useMessageStore from 'src/store/persisted/useMessageStore';
import { useWalletClient } from 'wagmi';

import ChatReactionPopover from './ChatReactionPopover';
import ChatMessageInput from './Input';
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
  const { address } = profile;

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
        ((await chat.history({
          ...baseConfig,
          limit: 30,
          threadhash: threadHash,
          toDecrypt: true
        })) as IMessageIPFSWithCID[]) ?? [];

      return transformMessages(history.reverse());
    },
    queryKey: ['get-messages', profile.did]
  });

  console.log(messages, 'message');

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
      await refetchMessages();
    },
    [refetchMessages, replyMessage, sendMessage]
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
        await refetchMessages();
      };
    },
    [refetchMessages, sendMessage]
  );

  const onRemoveReplyMessage = useCallback(() => {
    setReplyMessage(null);
  }, []);

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
        className="h-screen space-y-3 overflow-y-scroll px-4 py-2"
        ref={messageContainerref}
      >
        {messagesLoading && (
          <div className="flex h-full items-center justify-center">
            <Loader message="Loading messages..." />
          </div>
        )}
        {messages?.map((message) => {
          const isMessageFromProfile = message.from !== profile.address;
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
              <div className="max-w-[75%]">
                <div
                  className={
                    isMessageFromProfile
                      ? 'text-wrap rounded-2xl rounded-br-sm bg-[#EF4444] px-4 py-2 text-white'
                      : 'text-wrap rounded-2xl rounded-bl-sm bg-gray-300 px-4 py-2'
                  }
                >
                  {message.messageType === MessageType.TEXT &&
                    (message.messageObj as any).content}
                  {message.messageType === MessageType.IMAGE && (
                    <Image
                      alt=""
                      key={message.link}
                      src={message.messageContent}
                    />
                  )}
                  <RenderReplyMessage message={message as unknown as any} />
                  {/* {message.messageType === MessageType.REPLY &&
                    console.log(message)}
                  {message.messageType === MessageType.REPLY &&
                    (message.messageObj as any).content.messageType ===
                      MessageType.TEXT &&
                    (message.messageObj as any).content.messageObj.content} */}
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
        })}
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
