import getAvatar from '@hey/lib/getAvatar';
import { Image } from '@hey/ui';
import { chat } from '@pushprotocol/restapi';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
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

export const PreviewMessage = ({
  content,
  messageType
}: {
  content: string;
  messageType: string;
}) => {
  return (
    <p className="max-w-[150px] truncate text-sm text-gray-500">{content}</p>
  );
};

export default function PUSHPreviewChats() {
  const { setRecipientProfile } = usePushChatStore();
  const { currentProfile } = useProfileStore();
  const pgpPrivateKey = usePushChatStore((state) => state.pgpPrivateKey);

  const { data, isLoading } = useQuery({
    queryFn: async () => {
      if (typeof chat?.requests === 'undefined') {
        return;
      }
      const chats = await chat?.chats?.({
        account: getAccountFromProfile(currentProfile?.id),
        env: PUSH_ENV,
        pgpPrivateKey: pgpPrivateKey!,
        toDecrypt: true
      });
      return chats;
    },
    queryKey: ['getChats', chat]
  });

  return (
    <section className="flex flex-col gap-2.5	overflow-auto">
      {!isLoading ? (
        data
          ?.sort((a, b) => b!.msg!.timestamp! - a!.msg!.timestamp!)
          .map(async (item) => {
            const lensProfile = await getLensProfile(
              getProfileIdFromDID(item.msg.fromDID)
            );
            return (
              <div
                className={`flex h-16 cursor-pointer gap-2.5 rounded-lg  p-2.5 pr-3 transition-all hover:bg-gray-100 ${
                  lensProfile?.ownedBy.address ===
                    currentProfile?.ownedBy.address && 'bg-brand-100'
                }`}
                key={item?.msg?.link}
                onClick={() => setRecipientProfile(lensProfile)}
              >
                <Image
                  className="h-12 w-12 rounded-full border bg-gray-200 dark:border-gray-700"
                  height={40}
                  loading="lazy"
                  onError={({ currentTarget }) => {
                    currentTarget.src = getAvatar(item);
                  }}
                  src={getAvatar(item)}
                  width={40}
                />

                <div className="flex w-full	justify-between	">
                  <div>
                    <p className="bold max-w-[180px] truncate text-base">
                      {lensProfile?.handle?.localName}
                    </p>
                    <p className="max-w-[150px] truncate text-sm text-gray-500">
                      {item?.msg?.messageContent}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">
                      {dayjs(item?.msg?.timestamp).fromNow()}
                    </span>
                  </div>
                </div>
              </div>
            );
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
