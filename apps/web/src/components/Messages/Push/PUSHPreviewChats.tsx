import Loader from '@components/Shared/Loader';
import useFetchChats from '@components/utils/hooks/push/useFetchChats';
import formatHandle from 'lib/formatHandle';
import getAvatar from 'lib/getAvatar';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { usePushChatStore } from 'src/store/push-chat';
import { Image } from 'ui';

import { checkIfGroup, getGroupImage, getGroupPreviewMessage, getProfileFromDID, isCAIP } from './helper';

export const PreviewMessage = ({ messageType, content }: { messageType: string; content: string }) => {
  if (messageType === 'GIF') {
    return <Image className="right-2.5 top-2.5" src="/push/gitIcon.svg" alt="" />;
  }

  return <p className="max-w-[150px] truncate text-sm text-gray-500">{content}</p>;
};

export default function PUSHPreviewChats() {
  const router = useRouter();

  // const [parsedChats, setParsedChats] = useState<any>([]);
  const { fetchChats, loading } = useFetchChats();
  const selectedChatId = usePushChatStore((state) => state.selectedChatId);
  const connectedProfile = usePushChatStore((state) => state.connectedProfile);
  const chatsFeed = usePushChatStore((state) => state.chatsFeed);
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);
  const lensProfiles = usePushChatStore((state) => state.lensProfiles);
  const setSelectedChatId = usePushChatStore((state) => state.setSelectedChatId);

  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;

  // load all chatsFeed
  useEffect(() => {
    if (Object.keys(chatsFeed).length) {
      return;
    }

    (async function () {
      // only run this hook when there's a decrypted key availabe in storage
      if (!decryptedPgpPvtKey) {
        return;
      }
      await fetchChats();
    })();
  }, [decryptedPgpPvtKey, fetchChats]);

  // action for when you click on a chat
  const onChatFeedClick = (chatId: string) => {
    setSelectedChatId(chatId);
    const profileId: string = getProfileFromDID(chatId);
    if (isCAIP(chatId)) {
      router.push(`/messages/push/chat/${profileId}`);
    } else {
      router.push(`/messages/push/group/${profileId}`);
    }
  };

  return (
    <section className="flex flex-col gap-2.5	overflow-auto	">
      {!loading ? (
        Object.keys(chatsFeed).map((id: string) => {
          const feed = chatsFeed[id];
          const profileId: string = getProfileFromDID(feed.did ?? feed.chatId);
          const lensProfile = lensProfiles.get(profileId);
          const isGroup = checkIfGroup(feed);
          return (
            <div
              onClick={() => onChatFeedClick(id)}
              key={id}
              className={`flex h-16 cursor-pointer gap-2.5 rounded-lg  p-2.5 pr-3 transition-all hover:bg-gray-100 ${
                selectedChatId === id && 'bg-brand-100'
              }`}
            >
              {isGroup ? (
                <Image
                  src={getGroupImage(feed)}
                  loading="lazy"
                  className="h-12 w-12 rounded-full border bg-gray-200 dark:border-gray-700"
                  height={40}
                  width={40}
                  alt={feed.groupInformation?.groupName!}
                />
              ) : (
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
              )}
              <div className="flex w-full	justify-between	">
                <div>
                  {isGroup ? (
                    <>
                      <p className="bold max-w-[180px] truncate text-base">
                        {feed.groupInformation?.groupName}
                      </p>
                      <PreviewMessage
                        content={getGroupPreviewMessage(feed, connectedProfile?.did!, false).message}
                        messageType={getGroupPreviewMessage(feed, connectedProfile?.did!, false).type}
                      />
                    </>
                  ) : (
                    <>
                      <p className="bold max-w-[180px] truncate text-base">
                        {lensProfile?.name ?? formatHandle(lensProfile?.handle)}
                      </p>
                      <PreviewMessage content={feed.msg.messageContent} messageType={feed.msg.messageType} />
                    </>
                  )}
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
          <Loader message="Loading Chats" />
        </div>
      )}
    </section>
  );
}
