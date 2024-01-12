import type { Group } from '@hey/types/hey';
import type { FC } from 'react';

import { FireIcon } from '@heroicons/react/24/solid';
import getAvatar from '@hey/lib/getAvatar';
import sanitizeDisplayName from '@hey/lib/sanitizeDisplayName';
import { Image } from '@hey/ui';
import Link from 'next/link';
import { memo } from 'react';

import Slug from './Slug';

interface GroupProfileProps {
  group: Group;
  linkToProfile?: boolean;
}

const GroupProfile: FC<GroupProfileProps> = ({
  group,
  linkToProfile = true
}) => {
  const GroupAvatar = () => (
    <Image
      alt={group.slug}
      className="size-10 rounded-lg border bg-gray-200 dark:border-gray-700"
      height={40}
      loading="lazy"
      src={getAvatar(group)}
      width={40}
    />
  );

  const UserName = () => (
    <>
      <div className="flex max-w-sm items-center">
        <div className="text-md grid">
          <div className="truncate">{sanitizeDisplayName(group.name)}</div>
        </div>
        {group.featured ? (
          <FireIcon className="ml-1 size-4 text-yellow-500" />
        ) : null}
      </div>
      <div>
        <Slug className="text-sm" prefix="g/" slug={group.slug} />
      </div>
    </>
  );

  const GroupInfo: FC = () => {
    return (
      <div className="mr-8 flex items-center space-x-3">
        <GroupAvatar />
        <div>
          <UserName />
        </div>
      </div>
    );
  };

  return linkToProfile ? (
    <Link href={`/g/${group.slug}`}>
      <GroupInfo />
    </Link>
  ) : (
    <GroupInfo />
  );
};

export default memo(GroupProfile);
