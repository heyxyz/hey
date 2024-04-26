import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import Slug from '@components/Shared/Slug';
import getAvatar from '@hey/helpers/getAvatar';
import getLennyURL from '@hey/helpers/getLennyURL';
import getProfile from '@hey/helpers/getProfile';
import { Image } from '@hey/ui';
import Link from 'next/link';

interface InvitedByProps {
  profile: Profile;
}

const InvitedBy: FC<InvitedByProps> = ({ profile }) => {
  return (
    <div>
      <Link
        className="ld-text-gray-500 flex items-center space-x-2 text-sm"
        href={getProfile(profile).link}
      >
        <Image
          alt={profile.id}
          className="size-5 rounded-full border dark:border-gray-700"
          key={profile.id}
          onError={({ currentTarget }) => {
            currentTarget.src = getLennyURL(profile.id);
          }}
          src={getAvatar(profile)}
        />
        <span>
          Invited by <Slug slug={getProfile(profile).slugWithPrefix} />
        </span>
      </Link>
    </div>
  );
};

export default InvitedBy;
