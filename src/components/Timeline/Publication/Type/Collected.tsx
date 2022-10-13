import Slug from '@components/Shared/Slug';
import type { CollectedEvent } from '@generated/types';
import { CollectionIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import Link from 'next/link';
import type { FC } from 'react';

interface Props {
  collects: Array<CollectedEvent>;
  isComment?: boolean;
}

const Collected: FC<Props> = ({ collects, isComment }) => {
  const profile = collects[0].profile;
  const showOthers = collects.length > 1;

  return (
    <div
      className={clsx('flex items-center pb-4 space-x-1 text-gray-500 text-[13px]', {
        'ml-[45px]': isComment
      })}
    >
      <CollectionIcon className="w-4 h-4" />
      <Link href={`/u/${profile?.handle}`} className="max-w-xs truncate">
        {profile?.name ? <b>{profile?.name}</b> : <Slug slug={profile?.handle} prefix="@" />}
      </Link>
      <span>{showOthers && <span>and {collects.length - 1} others</span>} collected</span>
    </div>
  );
};

export default Collected;
