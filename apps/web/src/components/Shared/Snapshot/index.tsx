import clsx from 'clsx';
import formatAddress from 'lib/formatAddress';
import { stopEventPropagation } from 'lib/stopEventPropagation';
import Link from 'next/link';
import type { FC, ReactNode } from 'react';
import { useProposalQuery } from 'snapshot';
import { webClient } from 'snapshot/apollo';
import { Card, Image } from 'ui';

interface WrapperProps {
  children: ReactNode;
}

const Wrapper: FC<WrapperProps> = ({ children }) => (
  <Card className="mt-3 p-5" onClick={stopEventPropagation}>
    {children}
  </Card>
);

interface SnapshotProps {
  propsalId: string;
}

const Snapshot: FC<SnapshotProps> = ({ propsalId }) => {
  const { data, loading, error } = useProposalQuery({
    variables: { id: propsalId },
    client: webClient
  });

  if (loading) {
    // Add skeleton loader here
    return <Wrapper>Loading...</Wrapper>;
  }

  if (!data?.proposal || error) {
    return null;
  }

  const { proposal } = data;
  const { space } = proposal;
  const spaceUrl = `https://snapshot.org/#/${space?.id}`;

  return (
    <Wrapper>
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
    </Wrapper>
  );
};

export default Snapshot;
