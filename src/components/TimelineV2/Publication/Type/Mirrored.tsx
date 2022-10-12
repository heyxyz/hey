import Slug from '@components/Shared/Slug';
import type { MirrorEvent } from '@generated/types';
import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import type { FC } from 'react';

interface Props {
  mirrors: Array<MirrorEvent>;
}

const Mirrored: FC<Props> = ({ mirrors }) => {
  const profile = mirrors[0].profile;
  const showOthers = mirrors.length > 1;

  return (
    <div className="flex items-center pb-4 space-x-1 text-gray-500 text-[13px]">
      <SwitchHorizontalIcon className="w-4 h-4" />
      <Link href={`/u/${profile?.handle}`} className="max-w-xs truncate">
        {profile?.name ? <b>{profile?.name}</b> : <Slug slug={profile?.handle} prefix="@" />}
      </Link>
      <span>{showOthers && <span>and {mirrors.length - 1} others</span>} mirrored</span>
    </div>
  );
};

export default Mirrored;
