import type { Profile } from '@hey/lens';
import getAvatar from '@hey/lib/getAvatar';
import getProfile from '@hey/lib/getProfile';
import { Image } from '@hey/ui';
import { type FC } from 'react';
import { Link } from 'react-router-dom';

import Slug from '@/components/Shared/Slug';

interface InvitedByProps {
  profile: Profile;
}

const InvitedBy: FC<InvitedByProps> = ({ profile }) => {
  return (
    <div>
      <Link
        className="ld-text-gray-500 flex items-center space-x-2 text-sm"
        to={getProfile(profile).link}
      >
        <Image
          key={profile.id}
          className="h-5 w-5 rounded-full border dark:border-gray-700"
          src={getAvatar(profile)}
          alt={profile.id}
        />
        <span>
          Invited by <Slug slug={getProfile(profile).slugWithPrefix} />
        </span>
      </Link>
    </div>
  );
};

export default InvitedBy;
