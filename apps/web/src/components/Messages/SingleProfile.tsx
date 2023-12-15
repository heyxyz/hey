import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import UserProfile from '@components/Shared/UserProfile';
import {
  CheckBadgeIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/solid';
import { useProfileQuery } from '@hey/lens';
import getAvatar from '@hey/lib/getAvatar';
import getProfile from '@hey/lib/getProfile';
import hasMisused from '@hey/lib/hasMisused';
import { Image } from '@hey/ui';
import isVerified from '@lib/isVerified';

import UserProfileShimmer from '../Shared/Shimmer/UserProfileShimmer';

interface WalletProfileProps {
  fullProfile?: boolean;
  id: string;
  message?: string;
}

const SingleProfile: FC<WalletProfileProps> = ({
  fullProfile = false,
  id,
  message
}) => {
  const { data, loading: profileLoading } = useProfileQuery({
    variables: { request: { forProfileId: id } }
  });

  const profile = data?.profile as Profile;

  return (
    <div className="flex items-center justify-between">
      {profileLoading ? (
        <UserProfileShimmer />
      ) : profile ? (
        fullProfile ? (
          <UserProfile profile={profile} showUserPreview={false} />
        ) : (
          <div className="flex items-center space-x-2">
            <Image
              alt={profile.id}
              className="h-10 w-10 rounded-full border bg-gray-200 dark:border-gray-700"
              height={40}
              loading="lazy"
              src={getAvatar(profile)}
              width={40}
            />
            <div>
              <div className="flex max-w-sm items-center">
                <div>{getProfile(profile).displayName}</div>
                {isVerified(profile.id) ? (
                  <CheckBadgeIcon className="text-brand-500 ml-1 h-4 w-4" />
                ) : null}
                {hasMisused(profile.id) ? (
                  <ExclamationCircleIcon className="ml-1 h-4 w-4 text-red-500" />
                ) : null}
              </div>
              <div className="ld-text-gray-500 text-sm">{message}</div>
            </div>
          </div>
        )
      ) : null}
    </div>
  );
};

export default SingleProfile;
