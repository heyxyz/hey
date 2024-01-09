import type { IFeeds } from '@pushprotocol/restapi';

import { PhotoIcon } from '@heroicons/react/24/outline';
import { Profile, useProfileQuery } from '@hey/lens';
import getAvatar from '@hey/lib/getAvatar';
import { Image } from '@hey/ui';
import dayjs from 'dayjs';
import React from 'react';
import { usePushChatStore } from 'src/store/persisted/usePushChatStore';

import { getProfileIdFromDID } from '../helper';

interface ProfileProps {
  previewMessage: IFeeds;
}

const Profile: React.FC<ProfileProps> = ({ previewMessage }) => {
  const setRecipientProfile = usePushChatStore(
    (state) => state.setRecipientProfile
  );
  const profileID = getProfileIdFromDID(previewMessage.did);
  const { recipientProfile } = usePushChatStore();
  const { data } = useProfileQuery({
    skip: !profileID,
    variables: { request: { forProfileId: profileID } }
  });

  const lensProfile = data?.profile as Profile;
  const avatar = getAvatar(lensProfile);

  return (
    <div
      className={`flex h-16 cursor-pointer gap-2.5 rounded-lg  p-2.5 pr-3 transition-all hover:bg-gray-100 ${
        recipientProfile?.id === profileID && 'bg-brand-100'
      }`}
      key={previewMessage.chatId}
      onClick={() => {
        setRecipientProfile({
          id: lensProfile?.id,
          localHandle: lensProfile?.handle?.localName!,
          ownedBy: {
            address: lensProfile?.ownedBy?.address!
          },
          threadHash: previewMessage.threadhash!
        });
      }}
    >
      <Image
        className="h-12 w-12 rounded-full border bg-gray-200 dark:border-gray-700"
        height={40}
        loading="lazy"
        src={avatar}
        width={40}
      />
      <div className="flex w-full justify-between">
        <div>
          <p className="bold max-w-[180px] truncate text-base">
            @{lensProfile?.handle?.localName}
          </p>
          <p className="max-w-[150px] truncate text-sm text-gray-500">
            {previewMessage.msg.messageType === 'Text' ? (
              previewMessage.msg.messageContent
            ) : (
              <div className="flex gap-2">
                <PhotoIcon className=" h-6 w-5" />
                Attachment
              </div>
            )}
          </p>
        </div>
        <div>
          <span className="text-xs text-gray-500">
            {dayjs(previewMessage?.msg.timestamp).fromNow()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
