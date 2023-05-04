import { LENSTER_POLLS_SPACE, ZERO_ADDRESS } from 'data';
import generateSnapshotAccount from 'lib/generateSnapshotAccount';
import stopEventPropagation from 'lib/stopEventPropagation';
import type { FC, ReactNode } from 'react';
import { useState } from 'react';
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
  const [voterAddress, setVoterAddress] = useState<string>(ZERO_ADDRESS);

  const { loading: spaceLoading } = useSpaceQuery({
    client: webClient,
    variables: { id: proposalId },
    skip: !proposalId || !currentProfile,
    onCompleted: async ({ proposal }) => {
      if (proposal?.space?.id === LENSTER_POLLS_SPACE) {
        const { address } = await generateSnapshotAccount({
          ownedBy: currentProfile?.ownedBy,
          profileId: currentProfile?.id,
          snapshotId: proposalId
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
    fetchPolicy: 'no-cache'
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
      <span onClick={stopEventPropagation} data-testid={`poll-${proposal.id}`}>
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
