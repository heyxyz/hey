import Follow from '@components/Shared/Follow';
import Unfollow from '@components/Shared/Unfollow';
import UserProfile from '@components/Shared/UserProfile';
import type { Profile } from 'lens';
import React, { useEffect, useState } from 'react';
import { usePushChatStore } from 'src/store/push-chat';

interface MessageHeaderProps {
  profile?: Profile;
}

export default function MessageHeader({ profile }: MessageHeaderProps) {
  // get the connected profile
  const [following, setFollowing] = useState(false);
  const selectedChatId = usePushChatStore((state) => state.selectedChatId);
  const lensProfiles = usePushChatStore((state) => state.lensProfiles);

  useEffect(() => {
    const profile = lensProfiles.get(selectedChatId);
    setFollowing(profile?.isFollowedByMe ?? false);
  }, [lensProfiles, selectedChatId]);

  return (
    <section className="flex w-full justify-between border-b px-5	py-2.5	">
      <div className="flex items-center">
        <UserProfile profile={profile as Profile} />
      </div>
      <div className="flex items-center gap-4	">
        <img className="cursor-pointer" src="/push/video.svg" alt="video icon" />
        {following ? (
          <Unfollow profile={profile!} setFollowing={setFollowing} showText />
        ) : (
          <Follow profile={profile!} setFollowing={setFollowing} showText />
        )}
      </div>
    </section>
  );
}
