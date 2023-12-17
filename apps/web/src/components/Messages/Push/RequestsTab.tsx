import getAvatar from '@hey/lib/getAvatar';
import { Image } from '@hey/ui';
import { chat } from '@pushprotocol/restapi';
import dayjs from 'dayjs';
import React, { useEffect, useRef } from 'react';
import useProfileStore from 'src/store/persisted/useProfileStore';
import {
  PUSH_ENV,
  PUSH_TABS,
  usePushChatStore
} from 'src/store/persisted/usePushChatStore';

import { PreviewMessage } from './ChatsTabs';
import {
  getAccountFromProfile,
  getLensProfile,
  getProfileIdFromDID
} from './helper';

export default function PUSHPreviewRequests() {
  const pageRef = useRef<HTMLDivElement>(null);

  const requestsFeed = usePushChatStore((state) => state.requestsFeed);
  const setRecipientProfile = usePushChatStore(
    (state) => state.setRecipientProfile
  );
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);
  const updateRequestsFeed = usePushChatStore(
    (state) => state.updateRequestsFeed
  );

  const { currentProfile } = useProfileStore();
  const { recipientProfile } = usePushChatStore();

  const fetchRequests = async () => {
    if (typeof chat?.requests === 'undefined') {
      return;
    }
    const requests = await chat?.requests?.({
      account: getAccountFromProfile(currentProfile?.id),
      env: PUSH_ENV,
      pgpPrivateKey: pgpPrivateKey!,
      toDecrypt: true
    });
    const combinedRequests = [...requestsFeed, ...requests];

    const dedupedRequests = combinedRequests.filter(
      (request, index, self) =>
        index === self.findIndex((t) => t.did === request.did)
    );
    updateRequestsFeed(dedupedRequests);
  };

  useEffect(() => {
    fetchRequests();
  }, [chat, PUSH_TABS.CHATS]);

  return (
    <section className="flex flex-col	gap-2.5	">
      {requestsFeed
        ?.sort((a, b) => b?.msg?.timestamp! - a?.msg?.timestamp!)
        .map(async (item) => {
          const lensProfile = await getLensProfile(
            getProfileIdFromDID(item.msg.fromDID)
          );
          return (
            <div
              className={`flex h-16 cursor-pointer gap-2.5 rounded-lg  p-2.5 pr-3 transition-all hover:bg-gray-100 ${
                recipientProfile?.id ===
                  getProfileIdFromDID(item.msg.fromDID) && 'bg-brand-100'
              }`}
              key={item.chatId}
              onClick={() => {
                setRecipientProfile(lensProfile!);
              }}
            >
              {lensProfile ? (
                <Image
                  className="h-12 w-12 rounded-full border bg-gray-200 dark:border-gray-700"
                  height={40}
                  loading="lazy"
                  onError={({ currentTarget }) => {
                    currentTarget.src = getAvatar(lensProfile);
                  }}
                  src={getAvatar(lensProfile)}
                  width={40}
                />
              ) : null}

              <div className="flex w-full	justify-between	">
                <div>
                  <p className="bold max-w-[180px] truncate text-base">
                    {lensProfile ? (
                      <>
                        {lensProfile.handle?.localName}{' '}
                        {lensProfile.ownedBy.address}
                      </>
                    ) : null}
                  </p>
                  <PreviewMessage
                    content={item?.msg.messageContent}
                    messageType={item?.msg.messageType}
                  />
                </div>
                <div>
                  <span className="text-xs text-gray-500">
                    {dayjs(item?.msg.timestamp).fromNow()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

      {Object.keys(requestsFeed).length === 0 && (
        <div className="mt-12 flex h-full flex-grow items-center justify-center">
          No requests yet
        </div>
      )}

      <div className="invisible" ref={pageRef} />
    </section>
  );
}
