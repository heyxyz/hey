import type {
  ChatSendOptionsType,
  IFeeds,
  IMessageIPFS
} from '@pushprotocol/restapi';
import type { MessageType } from '@pushprotocol/restapi/src/lib/constants';

import { chat } from '@pushprotocol/restapi';
import clsx from 'clsx';
import React, { useRef } from 'react';
import toast from 'react-hot-toast';
import usePushClient from 'src/hooks/messaging/push/usePushClient';
import useProfileStore from 'src/store/persisted/useProfileStore';
import {
  PUSH_ENV,
  usePushChatStore
} from 'src/store/persisted/usePushChatStore';
import { useMutation } from 'wagmi';

import Attachment from './Attachment';
import Composer from './Composer';
import {
  dateToFromNowDaily,
  getAccountFromProfile,
  getProfileIdFromDID
} from './helper';
import InitialConversation from './InitialConversation';

const MessageCard = ({
  chat,
  position
}: {
  chat: IMessageIPFS;
  position: number;
}) => {
  const timestampDate = dateToFromNowDaily(chat.timestamp as number);
  return (
    <div className="flex gap-2">
      <div className="flex flex-1 flex-col">
        <div
          className={clsx(
            position === 0
              ? 'rounded-xl rounded-tl-sm'
              : position === 1
                ? 'self-end rounded-xl rounded-tr-sm bg-violet-500'
                : 'absolute top-[-16px] ml-11 rounded-xl rounded-tl-sm',
            'relative w-fit max-w-[80%] border py-3 pl-4 pr-[50px] font-medium'
          )}
        >
          <p
            className={clsx(
              position === 1 ? 'text-white' : '',
              'max-w-[100%] break-words text-sm'
            )}
          >
            {chat.messageContent}
          </p>
        </div>
        <span className="ml-2 flex justify-start">
          <p className="py-2 text-center text-xs text-gray-500">
            {timestampDate}
          </p>
        </span>
      </div>
    </div>
  );
};

const Messages = ({ chat }: { chat: IMessageIPFS }) => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  let position =
    getProfileIdFromDID(chat.fromDID) !== currentProfile?.id ? 0 : 1;

  if (chat.messageType === 'Text') {
    return <MessageCard chat={chat} position={position} />;
  }
  return <Attachment message={chat} />;
};

interface MessageBodyProps {
  selectedChat: IMessageIPFS[];
}

export default function MessageBody({ selectedChat }: MessageBodyProps) {
  const listInnerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const requestsFeed = usePushChatStore((state) => state.requestsFeed);
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const recepientProfie = usePushChatStore((state) => state.recipientProfile);

  const approvalRequired = requestsFeed?.find((item) =>
    item.did.includes(recepientProfie?.ownedBy.address)
  );
  const deleteRequestFeed = usePushChatStore(
    (state) => state.deleteRequestFeed
  );

  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);
  const setRecipientChat = usePushChatStore((state) => state.setRecipientChat);
  const pushClient = usePushClient();

  const approveUser = async (item: IFeeds) => {
    const address = getProfileIdFromDID(item.did!);
    try {
      await pushClient?.chat.accept(address);
      deleteRequestFeed(item.did);
      setRecipientChat(item.msg);
    } catch (error) {
      console.log(`[ERROR]: REJECT CHAT USER FAILED:`, error);
    }
  };

  const rejectUser = async (item: IFeeds) => {
    try {
      await pushClient?.chat.reject(item.did);
      deleteRequestFeed(item.did);
    } catch (error) {
      console.log(`[ERROR]: REJECT CHAT USER FAILED:`, error);
    }
  };

  const sendMessageMutation = useMutation({
    mutationFn: async (args: ChatSendOptionsType) => {
      const response = await chat.send({
        account: args.account,
        env: args.env,
        // @ts-ignore
        message: {
          content: args.message?.content as string,
          type: args.message?.type
        },
        pgpPrivateKey: args.pgpPrivateKey,
        to: args.to
      });
      return response;
    },
    mutationKey: ['sendMessage']
  });

  const sendMessage = async (messageType: MessageType, content: string) => {
    try {
      const sentMessage = await sendMessageMutation.mutateAsync({
        account: getAccountFromProfile(currentProfile?.id),
        env: PUSH_ENV,
        message: {
          content: content,
          // @ts-ignore
          type: messageType
        },
        pgpPrivateKey: pgpPrivateKey!,
        to: getAccountFromProfile(recepientProfie?.id)
      });

      setRecipientChat({
        ...sentMessage,
        messageContent: content
      });
    } catch (error) {
      toast.error(`Failed sending message: ${(error as Error).message}`);
    }
  };

  return (
    <section className="flex h-full flex-col p-3 pb-3">
      <div
        className="flex-grow overflow-auto px-2"
        // onScroll={onScroll}
        ref={listInnerRef}
      >
        <div className="flex flex-col gap-2.5">
          {selectedChat?.map?.((chat, index) => {
            return <Messages chat={chat} key={index} />;
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      {approvalRequired && (
        <InitialConversation
          approveUser={approveUser}
          rejectUser={rejectUser}
          user={approvalRequired}
        />
      )}

      <Composer
        disabledInput={sendMessageMutation.isLoading}
        listRef={listInnerRef}
        sendMessage={sendMessage}
      />
    </section>
  );
}
