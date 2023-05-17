import Follow from '@components/Shared/Follow';
import Slug from '@components/Shared/Slug';
import Unfollow from '@components/Shared/Unfollow';
import type { GroupDTO, IFeeds } from '@pushprotocol/restapi';
import type { Profile } from 'lens';
import formatHandle from 'lib/formatHandle';
import getAvatar from 'lib/getAvatar';
import React, { useEffect, useState } from 'react';
import { CHAT_TYPES, usePushChatStore } from 'src/store/push-chat';
import { Image } from 'ui';

import ModifiedImage from './ModifiedImage';

interface MessageHeaderProps {
  profile?: Profile;
  groupInfo?: GroupDTO;
  selectedChat: IFeeds;
}

const ImageWithDeprecatedIcon = ModifiedImage(Image);

export default function MessageHeader({ profile, groupInfo, selectedChat }: MessageHeaderProps) {
  // get the connected profile
  const [following, setFollowing] = useState(false);
  const selectedChatId = usePushChatStore((state) => state.selectedChatId);
  const selectedChatType = usePushChatStore((state) => state.selectedChatType);
  const lensProfiles = usePushChatStore((state) => state.lensProfiles);

  const deprecatedChat = selectedChat?.deprecated ? true : false;

  useEffect(() => {
    if (selectedChatType === CHAT_TYPES.GROUP) {
      return;
    }
    const profile = lensProfiles.get(selectedChatId);
    setFollowing(profile?.isFollowedByMe ?? false);
  }, [lensProfiles, selectedChatId, selectedChatType]);

  return (
    <section className="flex w-full justify-between border-b px-5	py-2.5">
      <div className="flex items-center">
        {profile && (
          <div className="flex flex-row items-center space-x-3">
            {deprecatedChat ? (
              <ImageWithDeprecatedIcon
                onError={({ currentTarget }) => {
                  currentTarget.src = getAvatar(profile, false);
                }}
                src={getAvatar(profile)}
                loading="lazy"
                className="h-12 w-12 rounded-full border bg-gray-200 dark:border-gray-700"
                height={40}
                width={40}
                alt={formatHandle(profile?.handle)}
              />
            ) : (
              <Image
                onError={({ currentTarget }) => {
                  currentTarget.src = getAvatar(profile, false);
                }}
                src={getAvatar(profile)}
                loading="lazy"
                className="h-12 w-12 rounded-full border bg-gray-200 dark:border-gray-700"
                height={40}
                width={40}
                alt={formatHandle(profile?.handle)}
              />
            )}
            <div className="flex flex-col">
              <p className="text-base">{profile?.name ?? formatHandle(profile?.handle)}</p>
              <Slug className="text-sm" slug={formatHandle(profile?.handle)} prefix="@" />
            </div>
          </div>
        )}{' '}
        {groupInfo && (
          <div className="flex items-center space-x-3">
            <Image
              src={groupInfo.groupImage!}
              loading="lazy"
              className="h-12 w-12 rounded-full border bg-gray-200 dark:border-gray-700"
              height={40}
              width={40}
              alt={groupInfo.groupName}
            />
            <p className="bold text-base leading-6">{groupInfo.groupName}</p>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4	">
        {groupInfo && (
          <div className="w-fit cursor-pointer">
            <Image className="h-10 w-9" src="/push/more.svg" alt="group info settings" />
          </div>
        )}
        <img className="cursor-pointer" src="/push/video.svg" alt="video icon" />
        {profile &&
          (following ? (
            <Unfollow profile={profile!} setFollowing={setFollowing} showText />
          ) : (
            <Follow profile={profile!} setFollowing={setFollowing} showText />
          ))}
      </div>
    </section>
  );
}
