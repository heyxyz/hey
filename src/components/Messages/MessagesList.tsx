import getAvatar from '@lib/getAvatar';
import type { Message } from '@xmtp/xmtp-js';
import clsx from 'clsx';
import dayjs from 'dayjs';
import type { FC, ReactNode } from 'react';
import React, { memo } from 'react';
import { useAppStore } from 'src/store/app';

const formatTime = (d: Date | undefined): string => (d ? dayjs(d).format('hh:mm a - MM/DD/YY') : '');

const isOnSameDay = (d1?: Date, d2?: Date): boolean => {
  return d1?.toDateString() === d2?.toDateString();
};

const formatDate = (d?: Date) => dayjs(d).format('MMMM D, YYYY');

interface MessageTileProps {
  message: Message;
}

const MessageTile: FC<MessageTileProps> = ({ message }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const address = currentProfile?.ownedBy;

  return (
    <div
      className={clsx(
        address === message.senderAddress ? 'items-end' : 'items-start',
        'flex flex-col mx-auto mb-4'
      )}
    >
      <div className="flex max-w-[60%]">
        {address !== message.senderAddress && (
          <img
            src={getAvatar(currentProfile)}
            className="h-10 w-10 bg-gray-200 rounded-full border dark:border-gray-700/80 mr-2"
            alt={currentProfile?.handle}
          />
        )}
        <div
          className={clsx(
            address === message.senderAddress ? 'bg-brand-500' : 'bg-gray-100',
            'px-4 py-2 rounded-lg'
          )}
        >
          <span
            className={clsx(address === message.senderAddress ? 'text-white' : 'text-black', 'block text-md')}
          >
            {message.error ? `Error: ${message.error?.message}` : message.content ?? ''}
          </span>
        </div>
      </div>
      <div className={clsx(address !== message.senderAddress ? 'ml-12' : '')}>
        <span className="text-xs place-self-end text-gray-400 uppercase">{formatTime(message.sent)}</span>
      </div>
    </div>
  );
};

interface Props {
  children: ReactNode;
}

const DateDividerBorder: FC<Props> = ({ children }) => (
  <>
    <div className="grow h-0.5 bg-gray-300/25" />
    {children}
    <div className="grow h-0.5 bg-gray-300/25" />
  </>
);

const DateDivider: FC<{ date?: Date }> = ({ date }) => (
  <div className="flex align-items-center items-center pb-8 pt-4">
    <DateDividerBorder>
      <span className="mx-11 flex-none text-gray-300 text-sm font-bold">{formatDate(date)}</span>
    </DateDividerBorder>
  </div>
);

const ConversationBeginningNotice: FC = () => (
  <div className="flex align-items-center justify-center pb-4">
    <span className="text-gray-300 text-sm font-bold">This is the beginning of the conversation</span>
  </div>
);

interface MessageListProps {
  messages: Message[];
}

const MessagesList: FC<MessageListProps> = ({ messages }) => {
  let lastMessageDate: Date | undefined;

  return (
    <div className="flex-grow flex">
      <div className="pb-6 md:pb-0 w-full flex flex-col self-end">
        <div className="max-h-[80vh] relative w-full bg-white px-4 pt-6 overflow-y-auto flex">
          <div className="w-full">
            {messages && messages.length ? <ConversationBeginningNotice /> : null}
            {messages?.map((msg: Message) => {
              const dateHasChanged = !isOnSameDay(lastMessageDate, msg.sent);
              lastMessageDate = msg.sent;
              return (
                <>
                  {dateHasChanged ? <DateDivider key={msg.id + 'divider'} date={msg.sent} /> : null}
                  <MessageTile message={msg} key={msg.id} />
                </>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(MessagesList);
