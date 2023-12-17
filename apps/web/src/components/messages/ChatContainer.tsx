import type { PushAPI } from '@pushprotocol/restapi';

import { InformationCircleIcon } from '@heroicons/react/24/outline';
import formatAddress from '@hey/lib/formatAddress';
import { Button, Spinner } from '@hey/ui';
import { getTwitterFormat } from '@lib/formatTime';
import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useCallback } from 'react';

import ChatMessageInput from './Input';

const ChatListItemContainer = ({
  profile,
  push
}: {
  profile: {
    address: string;
    did: string;
    isRequestProfile: boolean;
    name: string;
  };
  push: PushAPI;
}) => {
  const { address } = profile;
  const {
    data: messages,
    isLoading: messagesLoading,
    refetch: refetchMessages
  } = useQuery({
    enabled: !!address,
    queryFn: async () => {
      if (!address) {
        return;
      }
      return await push.chat.history(address);
    },
    queryKey: ['get-messages']
  });

  const { isPending: sendingMessage, mutateAsync: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      return await push.chat.send(address as string, {
        content: message,
        type: 'Text'
      });
    },
    mutationKey: ['send-message']
  });

  const { isPending: isApproving, mutateAsync: onApprove } = useMutation({
    mutationFn: async (did: string) => {
      return await push.chat.accept(did);
    },
    mutationKey: ['approve-user']
  });

  const { isPending: isRejecting, mutateAsync: onReject } = useMutation({
    mutationFn: async (did: string) => {
      return await push.chat.reject(did);
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

  return (
    <div className="flex max-h-[800px] pl-6">
      {/* <ChatList /> */}
      <div className="m-auto mx-10 hidden w-full">
        <h2 className="text-2xl">Select a message</h2>
        <p className="text-sm text-gray-600">
          Choose from your existing conversations, start a new one, or just keep
          swimming.
        </p>
        <Button className="my-4" size="lg">
          New message
        </Button>
      </div>
      <div className="flex w-full flex-col justify-between">
        <div className="flex items-center justify-between bg-white p-2 sm:px-6">
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
            <div>
              This user is not in your contacts, please reject or accept
            </div>
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
        <div className="border-b-[1px] border-gray-600" />
        <div className="h-screen space-y-3 overflow-y-scroll px-4 py-2">
          {messages?.reverse().map((message) => {
            const messageFrom = message.fromDID.split(':').pop() ?? '';
            const isMessageFromProfile = messageFrom !== profile.address;
            console.log(messageFrom, isMessageFromProfile, 'ib', profile);
            if (!message.messageObj) {
              return '';
            }

            return (
              <div
                className={
                  isMessageFromProfile
                    ? 'text-wrap ml-auto max-w-[40%] rounded-3xl rounded-br-sm bg-[#EF4444] p-4 text-white '
                    : 'text-wrap max-w-[40%] rounded-3xl rounded-bl-sm bg-gray-300 p-4'
                }
                key={message.link}
              >
                {typeof message.messageObj === 'string'
                  ? message.messageObj
                  : message.messageObj?.content.toString()}
                {message.timestamp && (
                  <span className="ml-auto block w-min">
                    {getTwitterFormat(dayjs(message.timestamp).toDate())}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <ChatMessageInput
          disabled={profile.isRequestProfile}
          onSend={onSendMessage}
        />
      </div>
    </div>
  );
};

export default ChatListItemContainer;
