import Loader from '@components/Shared/Loader';
import useFetchRequests from '@components/utils/hooks/push/useFetchRequests';
import formatHandle from 'lib/formatHandle';
import getAvatar from 'lib/getAvatar';
import moment from 'moment';
import { useRouter } from 'next/router';
import React from 'react';
import { usePushChatStore } from 'src/store/push-chat';
import { Image } from 'ui';

import { PreviewMessage } from './PUSHPreviewChats';

export default function PUSHPreviewChats() {
  const router = useRouter();

  const { loading } = useFetchRequests();
  const selectedChatId = usePushChatStore((state) => state.selectedChatId);
  const requestsFeed = usePushChatStore((state) => state.requestsFeed);
  const lensProfiles = usePushChatStore((state) => state.lensProfiles);

  // action for when you click on a chat
  const onChatFeedClick = (chatId: string) => {
    console.log('in here');
    router.push(`/messages/push/chat/${chatId}`);
  };

  return (
    <section className="flex flex-col	gap-2.5	">
      {!loading ? (
        Object.keys(requestsFeed).map((id: string) => {
          const feed = requestsFeed[id];
          const lensProfile = lensProfiles.get(id);
          return (
            <div
              onClick={() => onChatFeedClick(id)}
              key={id}
              className={`flex h-16 cursor-pointer gap-2.5 rounded-lg  p-2.5 pr-3 transition-all hover:bg-gray-100 ${
                selectedChatId === id && 'bg-brand-100'
              }`}
            >
              <Image
                onError={({ currentTarget }) => {
                  currentTarget.src = getAvatar(lensProfile, false);
                }}
                src={getAvatar(lensProfile)}
                loading="lazy"
                className="h-12 w-12 rounded-full border bg-gray-200 dark:border-gray-700"
                height={40}
                width={40}
                alt={formatHandle(lensProfile?.handle)}
              />
              <div className="flex w-full	justify-between	">
                <div>
                  <p className="bold max-w-[180px] truncate text-base">{formatHandle(lensProfile?.handle)}</p>
                  <PreviewMessage content={feed.msg.messageContent} messageType={feed.msg.messageType} />
                </div>
                <div>
                  <span className="text-xs text-gray-500">{moment(feed.msg.timestamp).fromNow()}</span>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex h-full flex-grow items-center justify-center">
          <Loader message="Loading Requests" />
        </div>
      )}
    </section>
  );
}
