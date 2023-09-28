import Slug from '@components/Shared/Slug';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { type InvitedResult, useDefaultProfileQuery } from '@hey/lens';
import formatAddress from '@hey/lib/formatAddress';
import formatHandle from '@hey/lib/formatHandle';
import { formatDate } from '@lib/formatTime';
import Link from 'next/link';
import type { FC } from 'react';

interface ProfileProps {
  invite: InvitedResult;
}

const Profile: FC<ProfileProps> = ({ invite }) => {
  const { data } = useDefaultProfileQuery({
    variables: { request: { ethereumAddress: invite.address } }
  });

  const profile = data?.defaultProfile;

  return (
    <div className="lt-text-gray-500 flex items-center space-x-2 rounded-xl border px-3 py-2.5 text-sm">
      <CheckCircleIcon className="text-brand h-5 w-5" />
      <span>
        <b>
          {profile ? (
            <Link href={`/u/${formatHandle(profile.handle)}`} target="_blank">
              <Slug prefix="@" slug={formatHandle(profile.handle)} />
            </Link>
          ) : (
            formatAddress(invite.address)
          )}
        </b>{' '}
        invited on {formatDate(invite.when)}
      </span>
    </div>
  );
};

export default Profile;
