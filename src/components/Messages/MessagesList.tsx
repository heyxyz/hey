import type { Profile } from '@generated/types';
import getAvatar from '@lib/getAvatar';
import type { Message } from '@xmtp/xmtp-js';
import clsx from 'clsx';
import dayjs from 'dayjs';
import type { FC, ReactNode } from 'react';
import React, { memo } from 'react';
import { useInView } from 'react-cool-inview';

const formatTime = (d: Date | undefined): string => (d ? dayjs(d).format('hh:mm a - MM/DD/YY') : '');

const isOnSameDay = (d1?: Date, d2?: Date): boolean => {
  return d1?.toDateString() === d2?.toDateString();
};

const formatDate = (d?: Date) => dayjs(d).format('MMMM D, YYYY');

interface MessageTileProps {
  message: Message;
  profile?: Profile;
  currentProfile?: Profile | null;
}

const MessageTile: FC<MessageTileProps> = ({ message, profile, currentProfile }) => {
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
            src={getAvatar(profile)}
            className="h-10 w-10 bg-gray-200 rounded-full border dark:border-gray-700/80 mr-2"
            alt={profile?.handle}
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
  fetchNextMessages: () => void;
  profile?: Profile;
  currentProfile?: Profile | null;
  hasMore: boolean;
}

const MessagesList: FC<MessageListProps> = ({
  messages,
  fetchNextMessages,
  profile,
  currentProfile,
  hasMore
}) => {
  let lastMessageDate: Date | undefined;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView) {
        return;
      }

      await fetchNextMessages();
    }
  });

  return (
    <div className="flex-grow flex h-[71vh]">
      <div className="pb-6 md:pb-0 w-full flex flex-col self-end">
        <div className="relative w-full bg-white px-4 pt-6 flex">
          <div className="flex flex-col-reverse h-[68vh] overflow-y-auto w-full">
            {messages?.map((msg: Message, idx) => {
              const dateHasChanged = !isOnSameDay(lastMessageDate, msg.sent);
              lastMessageDate = msg.sent;
              return (
                <div ref={idx === messages.length - 1 ? observe : null} key={msg.id}>
                  {dateHasChanged ? <DateDivider date={msg.sent} /> : null}
                  <MessageTile currentProfile={currentProfile} profile={profile} message={msg} />
                </div>
              );
            })}
            {hasMore ? (
              <div className="p-1 text-center text-gray-300 font-bold text-sm">Loading...</div>
            ) : (
              <ConversationBeginningNotice />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(MessagesList);
