import type { Profile } from '@hey/lens';
import type { CachedConversation } from '@xmtp/react-sdk';
import type { Address } from 'viem';

import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import Slug from '@components/Shared/Slug';
import {
  CheckBadgeIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/solid';
import { useDefaultProfileQuery } from '@hey/lens';
import formatAddress from '@hey/lib/formatAddress';
import getAvatar from '@hey/lib/getAvatar';
import getLennyURL from '@hey/lib/getLennyURL';
import getProfile from '@hey/lib/getProfile';
import getStampFyiURL from '@hey/lib/getStampFyiURL';
import hasMisused from '@hey/lib/hasMisused';
import { Image } from '@hey/ui';
import { type FC, useState } from 'react';
import isVerified from 'src/helpers/isVerified';

import LatestMessage from './LatestMessage';

interface UserProps {
  address: Address;
  conversation: CachedConversation;
}

const User: FC<UserProps> = ({ address, conversation }) => {
  const [fetchedProfile, setFetchedProfile] = useState<null | Profile>(null);

  const { data, loading } = useDefaultProfileQuery({
    onCompleted: (data) => {
      if (data.defaultProfile) {
        setFetchedProfile(data.defaultProfile as Profile);
      }
    },
    skip: !address || !!fetchedProfile,
    variables: { request: { for: address } }
  });

  if (loading) {
    return <UserProfileShimmer />;
  }

  const profile = (fetchedProfile || data?.defaultProfile) as Profile;

  if (!profile) {
    return (
      <div className="flex items-center space-x-3">
        <Image
          alt={address}
          className="z-[1] size-11 cursor-pointer rounded-full border bg-gray-200 dark:border-gray-700"
          height={44}
          loading="lazy"
          src={getStampFyiURL(address)}
          width={44}
        />
        <div className="space-y-1">
          <div className="font-semibold">{formatAddress(address)}</div>
          <LatestMessage conversation={conversation} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <Image
        alt={profile.id}
        className="z-[1] size-11 cursor-pointer rounded-full border bg-gray-200 dark:border-gray-700"
        height={44}
        loading="lazy"
        onError={({ currentTarget }) => {
          currentTarget.src = getLennyURL(profile.id);
        }}
        src={getAvatar(profile)}
        width={44}
      />
      <div className="space-y-1">
        <div className="flex max-w-sm flex-wrap items-center">
          <span className="font-semibold">
            {getProfile(profile).displayName}
          </span>
          <Slug
            className="ml-1 truncate text-sm"
            slug={getProfile(profile).slugWithPrefix}
          />
          {isVerified(profile.id) ? (
            <CheckBadgeIcon className="text-brand-500 ml-1 size-4" />
          ) : null}
          {hasMisused(profile.id) ? (
            <ExclamationCircleIcon className="ml-1 size-4" />
          ) : null}
        </div>
        <LatestMessage conversation={conversation} />
      </div>
    </div>
  );
};

export default User;
