import Slug from '@components/Shared/Slug';
import type { Profile } from '@hey/lens';
import formatHandle from '@hey/lib/formatHandle';
import getAvatar from '@hey/lib/getAvatar';
import getProfile from '@hey/lib/getProfile';
import { Image } from '@hey/ui';
import Link from 'next/link';
import type { FC } from 'react';

interface InvitedByProps {
  profile: Profile;
}

const InvitedBy: FC<InvitedByProps> = ({ profile }) => {
  return (
    <div data-testid="profile-invited-by">
      <Link
        className="lt-text-gray-500 flex items-center space-x-2 text-sm"
        href={getProfile(profile).link}
      >
        <Image
          key={profile.id}
          className="h-5 w-5 rounded-full border dark:border-gray-700"
          src={getAvatar(profile)}
          alt={profile.id}
        />
        <span>
          Invited by{' '}
          <Slug prefix="@" slug={formatHandle(profile.handle) || profile.id} />
        </span>
      </Link>
    </div>
  );
};

export default InvitedBy;
