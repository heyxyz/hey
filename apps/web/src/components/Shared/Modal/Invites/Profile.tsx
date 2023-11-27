import Slug from '@components/Shared/Slug';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import type { InvitedResult } from '@hey/lens';
import formatAddress from '@hey/lib/formatAddress';
import getProfile from '@hey/lib/getProfile';
import { formatDate } from '@lib/formatTime';
import { Link } from 'react-router-dom';
import { type FC } from 'react';

interface ProfileProps {
  invite: InvitedResult;
}

const Profile: FC<ProfileProps> = ({ invite }) => {
  return (
    <div className="ld-text-gray-500 flex items-center space-x-2 rounded-xl border px-3 py-2.5 text-sm">
      <CheckCircleIcon className="text-brand-500 h-5 w-5" />
      <span>
        <b>
          {invite.profileMinted ? (
            <Link to={getProfile(invite.profileMinted).link} target="_blank">
              <Slug slug={getProfile(invite.profileMinted).slugWithPrefix} />
            </Link>
          ) : (
            formatAddress(invite.by)
          )}
        </b>{' '}
        invited on {formatDate(invite.when)}
      </span>
    </div>
  );
};

export default Profile;
