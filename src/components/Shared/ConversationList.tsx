import { ChatIcon } from '@heroicons/react/outline';
import classNames from '@lib/classNames';
import truncate from '@lib/truncate';
import { Conversation, Message } from '@xmtp/xmtp-js';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useXmtpStore } from 'src/store/xmtp';
import { useEnsAddress } from 'wagmi';

import Address from './Address';

type ConversationTileProps = {
  conversation: Conversation;
  isSelected: boolean;
  onClick?: () => void;
};

const getLatestMessage = (messages: Message[]): Message | null =>
  messages?.length ? messages[messages.length - 1] : null;

const NoConversationsMessage = (): JSX.Element => {
  return (
    <div className="flex flex-col flex-grow justify-center h-[100%]">
      <div className="flex flex-col items-center px-4 text-center">
        <ChatIcon className="h-8 w-8 mb-1 stroke-n-200 md:stroke-n-300" aria-hidden="true" />
        <p className="text-xl md:text-lg text-n-200 md:text-n-300 font-bold">Your message list is empty</p>
        <p className="text-lx md:text-md text-n-200 font-normal">There are no messages for this address</p>
      </div>
    </div>
  );
};

const ConversationTile = ({
  conversation,
  isSelected,
  onClick
}: ConversationTileProps): JSX.Element | null => {
  const xmtpState = useXmtpStore((state) => state);
  const { messages, loading } = xmtpState;

  if (!messages.get(conversation.peerAddress)?.length) {
    return null;
  }

  const latestMessage = getLatestMessage(messages.get(conversation.peerAddress) ?? []);
  const path = `/messages/${conversation.peerAddress}`;

  if (!latestMessage) {
    return null;
  }

  return (
    <Link href={path} key={conversation.peerAddress}>
      <a onClick={onClick}>
        <div
          className={classNames(
            'h-20',
            'py-2',
            'px-4',
            'md:max-w-sm',
            'mx-auto',
            'bg-white',
            'space-y-2',
            'py-2',
            'flex',
            'items-center',
            'space-y-0',
            'space-x-4',
            'border-b-2',
            'border-gray-100',
            'hover:bg-bt-100',
            loading ? 'opacity-80' : 'opacity-100',
            isSelected ? 'bg-bt-200' : null
          )}
        >
          {/* <Avatar peerAddress={conversation.peerAddress} /> */}
          <div className="py-4 sm:text-left text w-full">
            <div className="grid-cols-2 grid">
              <Address
                address={conversation.peerAddress}
                className="text-black text-lg md:text-md font-bold place-self-start"
              />
              <span
                className={classNames(
                  'text-lg md:text-sm font-normal place-self-end',
                  isSelected ? 'text-n-500' : 'text-n-300',
                  loading ? 'animate-pulse' : ''
                )}
              >
                {latestMessage?.sent?.toLocaleDateString('en-US')}
              </span>
            </div>
            <p
              className={classNames(
                'text-[13px] md:text-sm font-normal text-ellipsis mt-0',
                isSelected ? 'text-n-500' : 'text-n-300',
                loading ? 'animate-pulse' : ''
              )}
            >
              {latestMessage && truncate(latestMessage.content, 75)}
            </p>
          </div>
        </div>
      </a>
    </Link>
  );
};

const ConversationsList = (): JSX.Element => {
  let queryAddress = window.location.pathname.replace('/dm/', '');
  const router = useRouter();
  const xmtpState = useXmtpStore((state) => state);
  const { messages, conversations } = xmtpState;
  const { data: ensAddress } = useEnsAddress({ name: queryAddress });

  const orderByLatestMessage = (convoA: Conversation, convoB: Conversation): number => {
    const convoAMessages = messages.get(convoA.peerAddress) ?? [];
    const convoBMessages = messages.get(convoB.peerAddress) ?? [];
    const convoALastMessageDate = getLatestMessage(convoAMessages)?.sent || new Date();
    const convoBLastMessageDate = getLatestMessage(convoBMessages)?.sent || new Date();
    return convoALastMessageDate < convoBLastMessageDate ? 1 : -1;
  };

  const reloadIfQueryParamPresent = async () => {
    if (window.location.pathname !== '/' && window.location.pathname !== '/messages') {
      if (queryAddress.includes('eth')) {
        queryAddress = ensAddress ?? '';
      }
      if (queryAddress && conversations && conversations.has(queryAddress)) {
        router.push(window.location.pathname);
      }
    }
  };

  useEffect(() => {
    reloadIfQueryParamPresent();
  }, [window.location.pathname]);

  if (!conversations || conversations.size == 0) {
    return <NoConversationsMessage />;
  }

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {conversations &&
        conversations.size > 0 &&
        Array.from(conversations.values())
          .sort(orderByLatestMessage)
          .map((convo) => {
            const isSelected = router.query.recipientWalletAddr == convo.peerAddress;
            return <ConversationTile key={convo.peerAddress} conversation={convo} isSelected={isSelected} />;
          })}
    </>
  );
};

export default React.memo(ConversationsList);
