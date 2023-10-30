import { SNAPSHOT_URL } from '@hey/data/constants';
import formatAddress from '@hey/lib/formatAddress';
import type { Proposal } from '@hey/snapshot';
import { Image } from '@hey/ui';
import cn from '@hey/ui/cn';
import Link from 'next/link';
import type { FC } from 'react';
import urlcat from 'urlcat';

interface HeaderProps {
  proposal: Proposal;
}

const Header: FC<HeaderProps> = ({ proposal }) => {
  const { id, title, space, state, author } = proposal;
  const spaceUrl = `${SNAPSHOT_URL}/#/${space?.id}`;

  return (
    <>
      <div className="mb-2 flex items-center space-x-1 text-sm">
        <div
          className={cn(
            state === 'active' ? 'bg-green-500' : 'bg-brand-500',
            'mr-1 rounded-full px-2 py-0.5 text-xs capitalize text-white'
          )}
        >
          {state}
        </div>
        <Image
          src={urlcat('https://cdn.stamp.fyi/space/:address', {
            address: space?.id
          })}
          className="mr-1 h-5 w-5 rounded-full"
          alt={space?.id}
        />
        <Link href={spaceUrl} className="font-bold" target="_blank">
          {space?.name ?? space?.id}
        </Link>
        <span>by</span>
        <Link href={`${SNAPSHOT_URL}/#/profile/${author}`} target="_blank">
          {formatAddress(author)}
        </Link>
      </div>
      <Link
        href={`${spaceUrl}/proposal/${id}`}
        className="font-bold"
        target="_blank"
      >
        {title}
      </Link>
    </>
  );
};

export default Header;
