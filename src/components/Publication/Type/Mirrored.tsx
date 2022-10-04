import Slug from '@components/Shared/Slug';
import { Mirror } from '@generated/types';
import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { FC } from 'react';

interface Props {
  publication: Mirror;
}

const Mirrored: FC<Props> = ({ publication }) => {
  return (
    <div className="flex items-center pb-4 space-x-1 text-gray-500 text-[13px]">
      <SwitchHorizontalIcon className="w-4 h-4" />
      <div className="space-x-1">
        <Link href={`/u/${publication?.profile?.handle}`} className="max-w-xs truncate">
          {publication?.profile?.name ? (
            <b>{publication?.profile?.name}</b>
          ) : (
            <Slug slug={publication?.profile?.handle} prefix="@" />
          )}
        </Link>
        <Link href={`/posts/${publication?.mirrorOf?.id}`}>
          <span>mirrored the </span>
          <b>{publication?.mirrorOf.__typename?.toLowerCase()}</b>
        </Link>
      </div>
    </div>
  );
};

export default Mirrored;
