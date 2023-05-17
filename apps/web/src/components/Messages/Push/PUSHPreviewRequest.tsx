import Loader from '@components/Shared/Loader';
import useFetchRequests from '@components/utils/hooks/push/useFetchRequests';
import { useIsInViewport } from '@components/utils/hooks/push/useIsInViewport';
import type { IFeeds } from '@pushprotocol/restapi';
import formatHandle from 'lib/formatHandle';
import getAvatar from 'lib/getAvatar';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { usePushChatStore } from 'src/store/push-chat';
import { Image } from 'ui';

import { checkIfGroup, getGroupImage, getGroupPreviewMessage, getProfileFromDID, isCAIP } from './helper';
import ModifiedImage from './ModifiedImage';
import { PreviewMessage } from './PUSHPreviewChats';

const requestLimit = 10;

const ImageWithDeprecatedIcon = ModifiedImage(Image);

export default function PUSHPreviewRequests() {
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);

  const { fetchRequests, loading } = useFetchRequests();
  const selectedChatId = usePushChatStore((state) => state.selectedChatId);
  const setSelectedChatId = usePushChatStore((state) => state.setSelectedChatId);
  const connectedProfile = usePushChatStore((state) => state.connectedProfile);
  const requestsFeed = usePushChatStore((state) => state.requestsFeed);
  const setRequestsFeed = usePushChatStore((state) => state.setRequestsFeed);
  const lensProfiles = usePushChatStore((state) => state.lensProfiles);
  const isInViewport1 = useIsInViewport(pageRef, '0px');
  const [page, setPage] = useState<number>(1);
  const [allFeeds, setAllFeeds] = useState<Array<any>>();
  const [paginateLoading, setPaginateLoading] = useState<boolean>(false);

  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);

  const decryptedPgpPvtKey = pgpPrivateKey.decrypted;

  // load all chatsFeed
  useEffect(() => {
    if (Object.keys(requestsFeed).length) {
      return;
    }

    (async function () {
      // only run this hook when there's a decrypted key availabe in storage
      if (!decryptedPgpPvtKey) {
        return;
      }
      let feeds = await fetchRequests({ page, requestLimit });
      let firstFeeds: { [key: string]: IFeeds } = { ...feeds };
      setRequestsFeed(firstFeeds);
    })();
  }, [decryptedPgpPvtKey, fetchRequests, page]);

  useEffect(() => {
    if (!isInViewport1 || loading || Object.keys(requestsFeed).length < requestLimit) {
      return;
    }

    let newPage = page + 1;
    setPage(newPage);
    // eslint-disable-next-line no-use-before-define
    callFeeds(newPage);
  }, [isInViewport1]);

  const callFeeds = async (page: number) => {
    if (!decryptedPgpPvtKey) {
      return;
    }

    try {
      setPaginateLoading(true);
      let feeds = await fetchRequests({ page, requestLimit });
      let newFeed: { [key: string]: IFeeds } = { ...requestsFeed, ...feeds };
      setRequestsFeed(newFeed);
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
    setRequestsFeed(requestsFeed);
    let getItems = withNestedKeys(requestsFeed);
    setAllFeeds(getItems);
  }, [requestsFeed]);

  // action for when you click on a chat
  const onRequestFeedClick = (chatId: string) => {
    setSelectedChatId(chatId);
    const profileId: string = getProfileFromDID(chatId);
    console.log(profileId, chatId);
    if (isCAIP(chatId)) {
      router.push(`/messages/push/chat/${profileId}`);
    } else {
      router.push(`/messages/push/group/${profileId}`);
    }
  };

  return (
    <section className="flex flex-col	gap-2.5	">
      {!loading ? (
        allFeeds
          ?.sort((a, b) => b?.msg?.timestamp - a?.msg?.timestamp)
          .map((item) => {
            let id = item?.id;
            const feed = requestsFeed[id];
            const profileId: string = getProfileFromDID(feed?.did ?? feed?.chatId);
            const lensProfile = lensProfiles.get(profileId);
            const isGroup = checkIfGroup(feed);
            const deprecated = feed?.deprecated ? true : false;
            return (
              <div
                onClick={() => onRequestFeedClick(id)}
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
                          {feed.groupInformation?.groupName}
                        </p>
                        <PreviewMessage
                          content={getGroupPreviewMessage(feed, connectedProfile?.did!, true).message}
                          messageType={getGroupPreviewMessage(feed, connectedProfile?.did!, true).type}
                        />
                      </>
                    ) : (
                      <>
                        <p className="bold max-w-[180px] truncate text-base">
                          {lensProfile?.name ?? formatHandle(lensProfile?.handle)}
                        </p>
                        <PreviewMessage
                          content={feed?.msg.messageContent}
                          messageType={feed?.msg.messageType}
                        />
                      </>
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">{moment(feed?.msg.timestamp).fromNow()}</span>
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

      {!loading && Object.keys(requestsFeed).length === 0 && (
        <div className="mt-12 flex h-full flex-grow items-center justify-center">No requests yet</div>
      )}

      <div ref={pageRef} className="invisible" />

      {paginateLoading && (
        <div className="flex h-full flex-grow items-center justify-center">
          <Loader message="Loading More Chats" />
        </div>
      )}
    </section>
  );
}
