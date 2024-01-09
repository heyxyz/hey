import type { IMessageIPFSWithCID } from '@pushprotocol/restapi';

import { ArrowUturnLeftIcon, FaceSmileIcon } from '@heroicons/react/24/outline';
import { MessageType } from '@pushprotocol/restapi/src/lib/constants';
import clsx from 'clsx';
import React, { useRef, useState } from 'react';
import usePushHooks from 'src/hooks/messaging/push/usePush';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { usePushChatStore } from 'src/store/persisted/usePushChatStore';

import type { MessageReactions } from '../Actions/Reactions';

import { ChatAction } from '../Actions/ChatAction';
import { DisplayReactions, Reactions } from '../Actions/Reactions';
import { getProfileIdFromDID } from '../helper';
import Attachment from './Attachment';
import ReplyMessage from './ReplyCard';
import TimeStamp from './TimeStamp';
import { MessageWrapper } from './Wrapper';

interface Props {
  message: IMessageIPFSWithCID;
  messageReactions: [] | MessageReactions[];
  replyMessage: IMessageIPFSWithCID | null;
}

export enum MessageOrigin {
  Receiver = 'receiver',
  Sender = 'sender'
}

interface MessageCardProps {
  chat: IMessageIPFSWithCID;
  className: string;
}

const MessageCard: React.FC<MessageCardProps> = ({ chat, className }) => {
  return (
    <p className={className}>
      {typeof chat.messageObj === 'string'
        ? chat.messageObj
        : (chat.messageObj?.content as string)}
    </p>
  );
};

const Message = ({ message, messageReactions, replyMessage }: Props) => {
  const [showChatActions, setShowChatActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const { decryptConversation, useSendMessage } = usePushHooks();
  const { setReplyToMessage } = usePushChatStore();
  const { mutateAsync: sendMessage } = useSendMessage();
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const setRecipientChat = usePushChatStore((state) => state.setRecipientChat);
  const recipientProfile = usePushChatStore((state) => state.recipientProfile);
  const reactionRef = useRef<HTMLDivElement | null>(null);

  const handleMouseEnter = () => {
    setShowChatActions(true);
  };

  const handleMouseLeave = () => {
    setShowChatActions(false);
  };

  const messageOrigin =
    getProfileIdFromDID(message.fromDID) === currentProfile?.id
      ? MessageOrigin.Sender
      : MessageOrigin.Receiver;

  const sendReaction = async (value: string) => {
    const sentMessage = await sendMessage({
      content: {
        content: value,
        type: MessageType.TEXT
      },
      reference: (message as IMessageIPFSWithCID).cid!,
      type: MessageType.REACTION
    });
    const decryptedMessage = await decryptConversation(sentMessage);
    setRecipientChat([decryptedMessage]);
    setShowReactions(false);
    setShowChatActions(true);
  };

  return (
    <div
      className={clsx('flex items-center', {
        'flex-row-reverse': messageOrigin === MessageOrigin.Sender
      })}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={clsx('flex-col', {
          'self-end': messageOrigin === MessageOrigin.Receiver
        })}
      >
        <MessageWrapper
          isAttachment={message.messageType !== 'Text'}
          messageOrigin={messageOrigin}
        >
          {replyMessage ? (
            <ReplyMessage
              chat={replyMessage}
              handle={
                messageOrigin === MessageOrigin.Receiver
                  ? currentProfile?.handle?.localName!
                  : recipientProfile?.localHandle!
              }
            />
          ) : null}
          {message.messageType === 'Text' ? (
            <MessageCard
              chat={message}
              className={clsx(
                messageOrigin === MessageOrigin.Sender ? 'text-white' : '',
                'max-w-[100%] break-words text-sm'
              )}
            />
          ) : (
            <Attachment message={message} />
          )}
        </MessageWrapper>
        <DisplayReactions MessageReactions={messageReactions} />
        <TimeStamp
          messageOrigin={messageOrigin}
          timestamp={message?.timestamp!}
        />
      </div>
      <div className="mr-3 mt-[-20px] flex">
        <ChatAction
          onClick={() => {
            setReplyToMessage(message);
          }}
          showAction={showChatActions}
        >
          <ArrowUturnLeftIcon
            className="text-brand-500 h-3 w-3"
            strokeWidth={2}
          />
        </ChatAction>
        <div ref={reactionRef}>
          <ChatAction
            onClick={() => {
              setShowReactions(true);
              setShowChatActions(false);
            }}
            showAction={showChatActions}
          >
            <FaceSmileIcon className={'text-brand-500 h-4 w-4'} />
          </ChatAction>
        </div>
        <div className="ml-2">
          {showReactions ? (
            <Reactions
              onClick={() => {
                setShowReactions(false);
                setShowChatActions(true);
              }}
              onValue={sendReaction}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Message;
