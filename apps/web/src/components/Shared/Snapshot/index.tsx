import { LENSTER_POLLS_SPACE } from 'data';
import generateSnapshotAccount from 'lib/generateSnapshotAccount';
import { stopEventPropagation } from 'lib/stopEventPropagation';
import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import { useInView } from 'react-cool-inview';
import type { Proposal, Vote } from 'snapshot';
import { useSnapshotQuery, useSpaceQuery } from 'snapshot';
import { webClient } from 'snapshot/apollo';
import { useAppStore } from 'src/store/app';
import { Card, Spinner } from 'ui';

import Choices from './Choices';
import Header from './Header';

interface WrapperProps {
  children: ReactNode;
  dataTestId?: string;
}

const Wrapper: FC<WrapperProps> = ({ children, dataTestId = '' }) => (
  <Card
    className="mt-3 cursor-auto p-5"
    dataTestId={dataTestId}
    onClick={stopEventPropagation}
  >
    {children}
  </Card>
);

interface SnapshotProps {
  proposalId: string;
}

const Snapshot: FC<SnapshotProps> = ({ proposalId }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [pollInterval, setPollInterval] = useState(0);
  const [voterAddress, setVoterAddress] = useState<string | null>(null);
  const { observe, inView } = useInView();

  const { loading: spaceLoading } = useSpaceQuery({
    client: webClient,
    variables: { id: proposalId },
    skip: !proposalId,
    onCompleted: async ({ proposal }) => {
      console.log(proposal);
      if (proposal?.space?.id === LENSTER_POLLS_SPACE) {
        const address = await generateSnapshotAccount({
          ownedBy: currentProfile?.ownedBy,
          profileId: currentProfile?.id,
          snapshotId: proposalId,
          hash: process.env.NEXT_PUBLIC_SNAPSHOT_VOTE_RELAY_HASH as string
        });

        setVoterAddress(address);
      } else {
        setVoterAddress(currentProfile?.ownedBy);
      }
    }
  });

  const { data, loading, error, refetch } = useSnapshotQuery({
    client: webClient,
    variables: {
      id: proposalId,
      where: { voter: voterAddress, proposal: proposalId }
    },
    skip: spaceLoading,
    pollInterval: inView ? pollInterval : 0,
    onCompleted: (data) => {
      if (data.proposal?.state === 'active') {
        setPollInterval(5000);
      }
    }
  });

  if (spaceLoading || loading) {
    // TODO: Add skeleton loader here
    return (
      <Wrapper>
        <div className="flex items-center justify-center">
          <Spinner size="xs" />
        </div>
      </Wrapper>
    );
  }

  if (!data?.proposal || error) {
    return null;
  }

  const { proposal, votes } = data;
  const isLensterPoll = proposal?.space?.id === LENSTER_POLLS_SPACE;

  if (isLensterPoll) {
    return (
      <span onClick={stopEventPropagation} ref={observe}>
        {voterAddress}
        <Choices
          proposal={proposal as Proposal}
          votes={votes as Vote[]}
          isLensterPoll={isLensterPoll}
          refetch={refetch}
        />
      </span>
    );
  }

  return (
    <Wrapper dataTestId={`snapshot-${proposal.id}`}>
      <span ref={observe} />
      <Header proposal={proposal as Proposal} />
      <Choices
        proposal={proposal as Proposal}
        votes={votes as Vote[]}
        refetch={refetch}
      />
    </Wrapper>
  );
};

export default Snapshot;
