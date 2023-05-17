import Loader from '@components/Shared/Loader';
import useFetchChats from '@components/utils/hooks/push/useFetchChats';
import { useIsInViewport } from '@components/utils/hooks/push/useIsInViewport';
import type { IFeeds } from '@pushprotocol/restapi/src/lib/types';
import formatHandle from 'lib/formatHandle';
import getAvatar from 'lib/getAvatar';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { usePushChatStore } from 'src/store/push-chat';
import { Image } from 'ui';

import {
  checkIfGroup,
  getGroupImage,
  getGroupPreviewMessage,
  getProfileFromDID,
  isCAIP
} from './helper';
import ModifiedImage from './ModifiedImage';

export const PreviewMessage = ({
  messageType,
  content
}: {
  messageType: string;
  content: string;
}) => {
  if (messageType === 'GIF') {
    return (
      <Image className="right-2.5 top-2.5" src="/push/gitIcon.svg" alt="" />
    );
  }

  return (
    <p className="max-w-[150px] truncate text-sm text-gray-500">{content}</p>
  );
};

const chatLimit = 10;

const ImageWithDeprecatedIcon = ModifiedImage(Image);

export default function PUSHPreviewChats() {
  const router = useRouter();
  const testRef = useRef<HTMLDivElement>(null);

  // const [parsedChats, setParsedChats] = useState<any>([]);
  const { fetchChats, loading } = useFetchChats();
  const selectedChatId = usePushChatStore((state) => state.selectedChatId);
  const connectedProfile = usePushChatStore((state) => state.connectedProfile);
  const chatsFeed = usePushChatStore((state) => state.chatsFeed);
  const setChatsFeed = usePushChatStore((state) => state.setChatsFeed);
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);
  const lensProfiles = usePushChatStore((state) => state.lensProfiles);
  const [page, setPage] = useState<number>(1);
  const [allFeeds, setAllFeeds] = useState<Array<any>>();
  const [paginateLoading, setPaginateLoading] = useState<boolean>(false);
  const isInViewport1 = useIsInViewport(testRef, '0px');
  const setSelectedChatId = usePushChatStore(
    (state) => state.setSelectedChatId
  );

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
      let feeds = await fetchChats({ page, chatLimit });
      let firstFeeds: { [key: string]: IFeeds } = { ...feeds };
      setChatsFeed(firstFeeds);
    })();
  }, [decryptedPgpPvtKey, fetchChats, page]);

  useEffect(() => {
    if (
      !isInViewport1 ||
      loading ||
      Object.keys(chatsFeed).length < chatLimit
    ) {
      return;
    }

    let newPage = page + 1;
    setPage(newPage);
    // eslint-disable-next-line no-use-before-define
    callFeeds(newPage);
  }, [isInViewport1]);

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

  const callFeeds = async (page: number) => {
    if (!decryptedPgpPvtKey) {
      return;
    }
    try {
      setPaginateLoading(true);
      let feeds = await fetchChats({ page, chatLimit });
      let newFeed: { [key: string]: IFeeds } = { ...chatsFeed, ...feeds };
      setChatsFeed(newFeed);
    } catch (error) {
      console.log(error);
      setPaginateLoading(false);
    } finally {
      setPaginateLoading(false);
    }
  };

  const withNestedKeys = (data?: any) => {
    let newArray = [];
    let newList = Object.entries(data).map((entry) => {
      return { [entry[0]]: entry[1] };
    });
    if (newList) {
      for (const element of newList) {
        const [resultOf] = Object.entries(element).map(([id, val]) => ({
          id,
          ...(val as Record<string, unknown>)
        }));
        newArray.push(resultOf);
      }
    }
    return newArray;
  };

  useEffect(() => {
    setChatsFeed(chatsFeed);
    let getItems = withNestedKeys(chatsFeed);
    setAllFeeds(getItems);
  }, [chatsFeed]);

  return (
    <section className="flex flex-col gap-2.5	overflow-auto">
      {!loading ? (
        allFeeds
          ?.sort((a, b) => b?.msg?.timestamp - a?.msg?.timestamp)
          .map((item) => {
            let id = item?.id;
            const feed = chatsFeed[id];
            const profileId: string = getProfileFromDID(
              feed?.did ?? feed?.chatId
            );
            const lensProfile = lensProfiles.get(profileId);
            const isGroup = checkIfGroup(feed);
            const deprecated = feed?.deprecated ? true : false;
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
                    alt={feed?.groupInformation?.groupName!}
                  />
                ) : deprecated ? (
                  <ImageWithDeprecatedIcon
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
                          {feed?.groupInformation?.groupName}
                        </p>
                        <PreviewMessage
                          content={
                            getGroupPreviewMessage(
                              feed,
                              connectedProfile?.did!,
                              false
                            ).message
                          }
                          messageType={
                            getGroupPreviewMessage(
                              feed,
                              connectedProfile?.did!,
                              false
                            ).type
                          }
                        />
                      </>
                    ) : (
                      <>
                        <p className="bold max-w-[180px] truncate text-base">
                          {lensProfile?.name ??
                            formatHandle(lensProfile?.handle)}
                        </p>
                        <PreviewMessage
                          content={feed?.msg.messageContent}
                          messageType={feed?.msg.messageType}
                        />
                      </>
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">
                      {moment(feed?.msg.timestamp).fromNow()}
                    </span>
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

      {!loading && Object.keys(chatsFeed).length === 0 && (
        <div className="mt-12 flex h-full flex-grow items-center justify-center">
          No chats yet
        </div>
      )}

      <div ref={testRef} className="invisible" />

      {paginateLoading && (
        <div className="flex h-full flex-grow items-center justify-center">
          <Loader message="Loading More Chats" />
        </div>
      )}
    </section>
  );
}
