import * as PushAPI from '@pushprotocol/restapi';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useProfileStore from 'src/store/persisted/useProfileStore';
import {
  PUSH_ENV,
  usePushChatStore
} from 'src/store/persisted/usePushChatStore';

import {
  getAccountFromProfile,
  getLensProfile,
  getProfileIdFromDID
} from './helper';
import Profile from './Profile';

export default function PUSHPreviewChats() {
  const { currentProfile } = useProfileStore();
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);

  const { data, isLoading } = useQuery({
    queryFn: async () => {
      if (typeof PushAPI?.chat?.requests === 'undefined') {
        return;
      }
      const chats = await PushAPI?.chat?.chats?.({
        account: getAccountFromProfile(currentProfile?.id),
        env: PUSH_ENV,
        pgpPrivateKey: pgpPrivateKey!,
        toDecrypt: true
      });

      if (chats) {
        const lensProfiles = await Promise.all(
          chats.map((chat) =>
            getLensProfile(getProfileIdFromDID(chat.msg.fromDID))
          )
        );

        return chats.map((chat, index) => ({
          ...chat,
          lensProfile: lensProfiles[index]
        }));
      }
    },
    queryKey: ['getChats', PushAPI]
  });

  return (
    <section className="flex flex-col gap-2.5	overflow-auto">
      {!isLoading ? (
        data
          ?.sort((a, b) => b!.msg!.timestamp! - a!.msg!.timestamp!)
          .map((item) => {
            return <Profile key={item.chatId} previewMessage={item} />;
          })
      ) : (
        <div className="mt-6 p-1 text-center text-sm font-bold text-gray-300">
          <span>Loading...</span>
        </div>
      )}

      {data?.length === 0 && (
        <div className="mt-12 flex h-full flex-grow items-center justify-center">
          No chats yet
        </div>
      )}
    </section>
  );
}
