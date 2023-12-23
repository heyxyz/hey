import { chat } from '@pushprotocol/restapi';
import React, { useEffect, useRef } from 'react';
import useProfileStore from 'src/store/persisted/useProfileStore';
import {
  PUSH_ENV,
  PUSH_TABS,
  usePushChatStore
} from 'src/store/persisted/usePushChatStore';

import { getAccountFromProfile } from './helper';
import Profile from './Profile';

export default function PUSHPreviewRequests() {
  const pageRef = useRef<HTMLDivElement>(null);

  const requestsFeed = usePushChatStore((state) => state.requestsFeed);
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);
  const updateRequestsFeed = usePushChatStore(
    (state) => state.updateRequestsFeed
  );

  const { currentProfile } = useProfileStore();

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
        .map((item) => {
          return <Profile key={item.chatId} previewMessage={item} />;
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
