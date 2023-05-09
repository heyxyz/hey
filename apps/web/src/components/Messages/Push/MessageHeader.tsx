import Follow from '@components/Shared/Follow';
import Unfollow from '@components/Shared/Unfollow';
import UserProfile from '@components/Shared/UserProfile';
import type { GroupDTO } from '@pushprotocol/restapi';
import type { Profile } from 'lens';
import React, { useEffect, useState } from 'react';
import { CHAT_TYPES, usePushChatStore } from 'src/store/push-chat';
import { Image } from 'ui';

interface MessageHeaderProps {
  profile?: Profile;
  groupInfo?: GroupDTO;
}

export default function MessageHeader({ profile, groupInfo }: MessageHeaderProps) {
  // get the connected profile
  const [following, setFollowing] = useState(false);
  const selectedChatId = usePushChatStore((state) => state.selectedChatId);
  const selectedChatType = usePushChatStore((state) => state.selectedChatType);
  const lensProfiles = usePushChatStore((state) => state.lensProfiles);

  useEffect(() => {
    if (selectedChatType === CHAT_TYPES.GROUP) {
      return;
    }
    const profile = lensProfiles.get(selectedChatId);
    setFollowing(profile?.isFollowedByMe ?? false);
  }, [lensProfiles, selectedChatId, selectedChatType]);

  return (
    <section className="flex w-full justify-between border-b px-5	py-2.5	">
      <div className="flex items-center">
        {profile && <UserProfile profile={profile as Profile} />}{' '}
        {groupInfo && (
          <div className="flex items-center space-x-3">
            <Image
              src={groupInfo.groupImage!}
              loading="lazy"
              className="h-10 w-10 rounded-full border bg-gray-200 dark:border-gray-700"
              height={40}
              width={40}
              alt={groupInfo.groupName}
            />
            <p className="bold text-base leading-6">{groupInfo.groupName}</p>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4	">
        {profile && <img className="cursor-pointer" src="/push/video.svg" alt="video icon" />}
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
