import Slug from '@components/Shared/Slug';
import type { Profile } from '@lenster/lens';
import formatHandle from '@lenster/lib/formatHandle';
import getAvatar from '@lenster/lib/getAvatar';
import { Image } from '@lenster/ui';
import { Trans } from '@lingui/macro';
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
        href={`/u/${formatHandle(profile.handle)}`}
      >
        <Image
          key={profile.handle}
          className="h-5 w-5 rounded-full border dark:border-gray-700"
          src={getAvatar(profile)}
          alt={formatHandle(profile?.handle)}
        />
        <span>
          <Trans>
            Invited by <Slug prefix="@" slug={formatHandle(profile.handle)} />
          </Trans>
        </span>
      </Link>
    </div>
  );
};

export default InvitedBy;
