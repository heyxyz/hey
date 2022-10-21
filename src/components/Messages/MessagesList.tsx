import { Card } from '@components/UI/Card';
import type { Profile } from '@generated/types';
import { ExclamationIcon } from '@heroicons/react/solid';
import getAvatar from '@lib/getAvatar';
import type { Message } from '@xmtp/xmtp-js';
import clsx from 'clsx';
import dayjs from 'dayjs';
import type { FC, ReactNode } from 'react';
import React, { memo } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const formatTime = (d: Date | undefined): string => (d ? dayjs(d).format('hh:mm a - MM/DD/YY') : '');

const isOnSameDay = (d1?: Date, d2?: Date): boolean => {
  return dayjs(d1).format('YYYYMMDD') === dayjs(d2).format('YYYYMMDD');
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
        address === message.senderAddress ? 'items-end mr-4' : 'items-start',
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

const MissingXmtpAuth: FC = () => (
  <Card as="aside" className="mb-4 border-gray-400 !bg-gray-300 !bg-opacity-20 space-y-2.5 p-5">
    <div className="flex items-center space-x-2 font-bold">
      <ExclamationIcon className="w-5 h-5" />
      <p>This profile has not enabled DMs yet</p>
    </div>
    <p className="text-sm leading-[22px]">Messages can't be sent until they create their keys with XMTP.</p>
  </Card>
);

const ConversationBeginningNotice: FC = () => (
  <div className="flex align-items-center justify-center pb-4">
    <span className="text-gray-300 text-sm font-bold">This is the beginning of the conversation</span>
  </div>
);

const LoadingMore: FC = () => (
  <div className="p-1 text-center text-gray-300 font-bold text-sm">Loading...</div>
);

interface MessageListProps {
  messages: Message[];
  fetchNextMessages: () => void;
  profile?: Profile;
  currentProfile?: Profile | null;
  hasMore: boolean;
  missingXmtpAuth: boolean;
}

const MessagesList: FC<MessageListProps> = ({
  messages,
  fetchNextMessages,
  profile,
  currentProfile,
  hasMore,
  missingXmtpAuth
}) => {
  let lastMessageDate: Date | undefined;

  return (
    <div className="flex-grow flex h-[75%]">
      <div className="relative w-full h-full bg-white px-4 pt-6 flex">
        <div
          id="scrollableDiv"
          className="flex flex-col h-full overflow-y-auto w-full"
          style={{ flexDirection: 'column-reverse' }}
        >
          {missingXmtpAuth && <MissingXmtpAuth />}
          <InfiniteScroll
            dataLength={messages.length}
            next={fetchNextMessages}
            style={{ display: 'flex', flexDirection: 'column-reverse' }}
            inverse={true}
            endMessage={<ConversationBeginningNotice />}
            hasMore={hasMore}
            loader={<LoadingMore />}
            scrollableTarget="scrollableDiv"
          >
            {messages?.map((msg: Message, index: number) => {
              const dateHasChanged = lastMessageDate ? !isOnSameDay(lastMessageDate, msg.sent) : false;
              lastMessageDate = msg.sent;
              return (
                <div key={`${msg.id}_${index}`}>
                  <MessageTile currentProfile={currentProfile} profile={profile} message={msg} />
                  {dateHasChanged ? <DateDivider date={msg.sent} /> : null}
                </div>
              );
            })}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default memo(MessagesList);
