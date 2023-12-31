import React, { useEffect, useRef } from 'react';
import usePushHooks from 'src/hooks/messaging/push/usePush';
import {
  PUSH_TABS,
  usePushChatStore
} from 'src/store/persisted/usePushChatStore';

import Profile from '../Header/Profile';

export default function PUSHPreviewRequests() {
  const pageRef = useRef<HTMLDivElement>(null);

  const requestsFeed = usePushChatStore((state) => state.requestsFeed);
  const updateRequestsFeed = usePushChatStore(
    (state) => state.updateRequestsFeed
  );

  const { useGetChatRequests } = usePushHooks();
  const { data } = useGetChatRequests();

  const updateRequests = async () => {
    if (!data) {
      return;
    }
    const combinedRequests = [...requestsFeed, ...data];
    const dedupedRequests = combinedRequests.filter(
      (request, index, self) =>
        index === self.findIndex((t) => t.did === request.did)
    );
    updateRequestsFeed(dedupedRequests);
  };

  useEffect(() => {
    updateRequests();
  }, [data, PUSH_TABS.CHATS]);

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
