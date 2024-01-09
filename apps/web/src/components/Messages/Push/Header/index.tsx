import type { Profile } from 'src/store/persisted/usePushChatStore';

import Slug from '@components/Shared/Slug';
import getAvatar from '@hey/lib/getAvatar';
import { Image } from '@hey/ui';
import React from 'react';

interface MessageHeaderProps {
  profile?: Profile;
}

export default function Header({ profile }: MessageHeaderProps) {
  const avatar = getAvatar(profile);
  return (
    <section className="flex w-full justify-between border-b px-5	py-2.5">
      <div className="flex items-center">
        {profile && (
          <div className="flex flex-row items-center space-x-3">
            <Image
              className="h-12 w-12 rounded-full border bg-gray-200 dark:border-gray-700"
              height={40}
              loading="lazy"
              onError={({ currentTarget }) => {
                currentTarget.src = avatar;
              }}
              src={avatar}
              width={40}
            />

            <div className="flex flex-col">
              <p className="text-base">{profile?.ownedBy.address}</p>
              <Slug
                className="text-sm"
                prefix="@"
                slug={profile.localHandle!}
              />
            </div>
          </div>
        )}{' '}
      </div>
    </section>
  );
}
