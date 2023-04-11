import clsx from 'clsx';
import formatAddress from 'lib/formatAddress';
import Link from 'next/link';
import type { FC } from 'react';
import type { Proposal } from 'snapshot';
import { Image } from 'ui';

interface HeaderProps {
  proposal: Proposal;
}

const Header: FC<HeaderProps> = ({ proposal }) => {
  const { space } = proposal;
  const spaceUrl = `https://snapshot.org/#/${space?.id}`;

  return (
    <>
      <div className="mb-2 flex items-center space-x-1 text-sm">
        <div
          className={clsx(
            proposal.state === 'active' ? 'bg-green-500' : 'bg-brand-500',
            'mr-1 rounded-full px-2 py-0.5 text-xs capitalize text-white'
          )}
        >
          {proposal.state}
        </div>
        <Image
          src={`https://cdn.stamp.fyi/space/${space?.id}`}
          className="mr-1 h-5 w-5 rounded-full"
          alt={space?.id}
        />
        <Link href={spaceUrl} className="font-bold" target="_blank">
          {space?.name ?? space?.id}
        </Link>
        <span>by</span>
        <Link href={`https://snapshot.org/#/profile/${proposal.author}`} target="_blank">
          {formatAddress(proposal.author)}
        </Link>
      </div>
      <Link href={`${spaceUrl}/proposal/${proposal.id}`} className="font-bold" target="_blank">
        {proposal.title}
      </Link>
    </>
  );
};

export default Header;
