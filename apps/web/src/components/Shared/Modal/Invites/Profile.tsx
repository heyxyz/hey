import type { InvitedResult } from '@hey/lens';
import type { FC } from 'react';

import Slug from '@components/Shared/Slug';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import formatDate from '@hey/lib/datetime/formatDate';
import formatAddress from '@hey/lib/formatAddress';
import getProfile from '@hey/lib/getProfile';
import Link from 'next/link';

interface ProfileProps {
  invite: InvitedResult;
}

const Profile: FC<ProfileProps> = ({ invite }) => {
  return (
    <div className="ld-text-gray-500 flex items-center space-x-2 rounded-xl border px-3 py-2.5 text-sm">
      <CheckCircleIcon className="text-brand-500 size-5" />
      <span>
        <b>
          {invite.profileMinted ? (
            <Link href={getProfile(invite.profileMinted).link} target="_blank">
              <Slug slug={getProfile(invite.profileMinted).slugWithPrefix} />
            </Link>
          ) : (
            formatAddress(invite.addressInvited)
          )}
        </b>{' '}
        invited on {formatDate(invite.when)}
      </span>
    </div>
  );
};

export default Profile;
