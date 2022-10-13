import Slug from '@components/Shared/Slug';
import type { ReactionEvent } from '@generated/types';
import { HeartIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import Link from 'next/link';
import type { FC } from 'react';

interface Props {
  reactions: Array<ReactionEvent>;
  isComment?: boolean;
}

const Reacted: FC<Props> = ({ reactions, isComment }) => {
  const profile = reactions[0].profile;
  const showOthers = reactions.length > 1;

  return (
    <div
      className={clsx('flex items-center pb-4 space-x-1 text-gray-500 text-[13px]', {
        'ml-[45px]': isComment
      })}
    >
      <HeartIcon className="w-4 h-4" />
      <Link href={`/u/${profile?.handle}`} className="max-w-xs truncate">
        {profile?.name ? <b>{profile?.name}</b> : <Slug slug={profile?.handle} prefix="@" />}
      </Link>
      <span>{showOthers && <span>and {reactions.length - 1} others</span>} reacted</span>
    </div>
  );
};

export default Reacted;
