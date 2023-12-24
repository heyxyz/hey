import type { IMessageIPFS } from '@pushprotocol/restapi';
import type { ReactNode } from 'react';

import { ArrowUturnLeftIcon, FaceSmileIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { usePushChatStore } from 'src/store/persisted/usePushChatStore';

import Attachment from './Attachment';
import { dateToFromNowDaily, getProfileIdFromDID } from './helper';

interface Props {
  message: IMessageIPFS;
}

interface ChatAction {
  children: ReactNode;
  onClick: () => void;
  showAction: boolean;
}

enum MessageOrigin {
  Sender,
  Receiver
}

const ChatAction: React.FC<ChatAction> = ({
  children,
  onClick,
  showAction
}) => (
  <motion.div
    animate={{ opacity: showAction ? 1 : 0 }}
    className="border-brand-400 ml-4 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border"
    initial={{ opacity: 1 }}
    onClick={onClick}
  >
    {children}
  </motion.div>
);

interface MessageWrapperProps {
  children: ReactNode;
  isAttachment: boolean;
  messageOrigin: MessageOrigin;
}

const MessageWrapper: React.FC<MessageWrapperProps> = ({
  children,
  isAttachment,
  messageOrigin
}) => {
  const baseClass = 'relative w-fit max-w-[80%] font-medium';
  const textClass = 'border py-3 pl-4 pr-[50px]';
  const attachmentClass = '';

  const messageClass = clsx(
    messageOrigin === MessageOrigin.Receiver
      ? 'rounded-xl rounded-tl-sm'
      : messageOrigin === MessageOrigin.Sender
        ? 'self-end rounded-xl rounded-tr-sm bg-violet-500'
        : 'absolute top-[-16px] ml-11 rounded-xl rounded-tl-sm',
    isAttachment ? attachmentClass : textClass,
    baseClass
  );

  return <div className={messageClass}>{children}</div>;
};

interface TimestampProps {
  timestamp: number;
}

const TimeStamp: React.FC<TimestampProps> = ({ timestamp }) => {
  const timestampDate = dateToFromNowDaily(timestamp);
  return (
    <span className="ml-2 flex justify-start">
      <p className="py-2 text-center text-xs text-gray-500">{timestampDate}</p>
    </span>
  );
};

interface MessageCardProps {
  chat: IMessageIPFS;
  className: string;
}

const MessageCard: React.FC<MessageCardProps> = ({ chat, className }) => {
  const timestampDate = dateToFromNowDaily(chat.timestamp as number);
  return (
    <>
      <p className={className}>{chat.messageContent}</p>
      <span className="ml-2 flex justify-start">
        <p className="py-2 text-center text-xs text-gray-500">
          {timestampDate}
        </p>
      </span>
    </>
  );
};

const Message = ({ message }: Props) => {
  const [showChatActions, setShowChatActions] = useState(false);
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const { setReplyToMessage } = usePushChatStore();

  const handleMouseEnter = () => {
    setShowChatActions(true);
  };

  const handleMouseLeave = () => {
    setShowChatActions(false);
  };

  const messageOrigin =
    getProfileIdFromDID(message.fromDID) !== currentProfile?.id
      ? MessageOrigin.Sender
      : MessageOrigin.Receiver;
  return (
    <div
      className="flex flex-row items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <MessageWrapper isAttachment={true} messageOrigin={messageOrigin}>
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
        <TimeStamp timestamp={message?.timestamp!} />
      </MessageWrapper>

      <ChatAction onClick={() => {}} showAction={showChatActions}>
        <ArrowUturnLeftIcon
          className="text-brand-500 h-3 w-3"
          strokeWidth={2}
        />
      </ChatAction>
      <ChatAction
        onClick={() => {
          setReplyToMessage(message);
        }}
        showAction={showChatActions}
      >
        <FaceSmileIcon className={'text-brand-500 h-4 w-4'} />
      </ChatAction>
    </div>
  );
};

export default Message;
