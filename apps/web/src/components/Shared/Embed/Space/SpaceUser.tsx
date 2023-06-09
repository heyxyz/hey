import Slug from '@components/Shared/Slug';
import { BadgeCheckIcon } from '@heroicons/react/solid';
import type { Profile } from '@lenster/lens';
import { useProfileQuery } from '@lenster/lens';
import formatHandle from '@lenster/lib/formatHandle';
import getAvatar from '@lenster/lib/getAvatar';
import isVerified from '@lenster/lib/isVerified';
import sanitizeDisplayName from '@lenster/lib/sanitizeDisplayName';
import { Image } from '@lenster/ui';
import { type FC } from 'react';

interface SpaceUserProps {
  profileId: string;
}

const SpaceUser: FC<SpaceUserProps> = ({ profileId }) => {
  const { data, loading } = useProfileQuery({
    variables: { request: { profileId } },
    skip: !profileId || profileId === 'Guest'
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data?.profile) {
    return null;
  }

  const profile = data?.profile as Profile;

  const UserAvatar = () => (
    <Image
      src={getAvatar(profile)}
      loading="lazy"
      className="h-14 w-14 rounded-full border bg-gray-200 dark:border-gray-700"
      height={24}
      width={24}
      alt={formatHandle(profile?.handle)}
    />
  );

  const UserName = () => (
    <div className="flex max-w-[150px] items-center">
      <div className="truncate">
        {sanitizeDisplayName(profile?.name) ?? formatHandle(profile?.handle)}
      </div>
      {isVerified(profile?.id) && (
        <BadgeCheckIcon className="text-brand ml-1 h-4 w-4" />
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      <UserAvatar />
      <UserName />
    </div>
  );
};

export default SpaceUser;
