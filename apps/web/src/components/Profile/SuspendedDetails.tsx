import type { Profile } from '@hey/lens';
import type { FC, ReactNode } from 'react';

import Slug from '@components/Shared/Slug';
import { STATIC_IMAGES_URL } from '@hey/data/constants';
import getProfile from '@hey/lib/getProfile';
import { Image } from '@hey/ui';

export const MetaDetails = ({
  children,
  icon
}: {
  children: ReactNode;
  icon: ReactNode;
}) => (
  <div className="flex items-center gap-2">
    {icon}
    <div className="text-md truncate">{children}</div>
  </div>
);

interface SuspendedDetailsProps {
  profile: Profile;
}

const SuspendedDetails: FC<SuspendedDetailsProps> = ({ profile }) => {
  return (
    <div className="space-y-5 px-5 sm:px-0">
      <div className="relative -mt-24 size-32 sm:-mt-32 sm:size-52">
        <Image
          alt={profile.id}
          className="size-32 rounded-xl bg-gray-200 ring-8 ring-gray-50 sm:size-52 dark:bg-gray-700 dark:ring-black"
          height={128}
          src={`${STATIC_IMAGES_URL}/suspended.png`}
          width={128}
        />
      </div>
      <div className="space-y-1 py-2">
        <div className="truncate text-2xl font-bold">Suspended</div>
        <div>
          <Slug
            className="text-sm sm:text-base"
            slug={getProfile(profile).slugWithPrefix}
          />
        </div>
      </div>
    </div>
  );
};

export default SuspendedDetails;
