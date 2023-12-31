import React from 'react';
import usePushHooks from 'src/hooks/messaging/push/usePush';

import Profile from '../Header/Profile';

export default function PUSHPreviewChats() {
  const { useGetChats } = usePushHooks();
  const { data, isLoading } = useGetChats();

  return (
    <section className="flex flex-col gap-2.5	overflow-auto">
      {isLoading ? (
        <div className="mt-6 p-1 text-center text-sm font-bold text-gray-300">
          <span>Loading...</span>
        </div>
      ) : (
        data
          ?.sort((a, b) => b!.msg!.timestamp! - a!.msg!.timestamp!)
          .map((item) => {
            return <Profile key={item.chatId} previewMessage={item} />;
          })
      )}

      {data?.length === 0 && (
        <div className="mt-12 flex h-full flex-grow items-center justify-center">
          No chats yet
        </div>
      )}
    </section>
  );
}
