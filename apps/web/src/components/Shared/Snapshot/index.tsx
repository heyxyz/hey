import { LENSTER_POLLS_SPACE, ZERO_ADDRESS } from '@lenster/data';
import getSnapshotProposal from '@lib/getSnapshotProposal';
import getSnapshotSpace from '@lib/getSnapshotSpace';
import { useQuery } from '@tanstack/react-query';
import type { Proposal, Vote } from '@workers/snapshot-relay';
import generateSnapshotAccount from 'lib/generateSnapshotAccount';
import stopEventPropagation from 'lib/stopEventPropagation';
import type { FC, ReactNode } from 'react';
import { useState } from 'react';
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

  const { isLoading: spaceLoading } = useQuery(['space', proposalId], () =>
    getSnapshotSpace(proposalId).then(async (res) => {
      if (res.spaceId === LENSTER_POLLS_SPACE) {
        const { address } = await generateSnapshotAccount({
          ownedBy: currentProfile?.ownedBy,
          profileId: currentProfile?.id,
          proposalId
        });

        setVoterAddress(address);
      } else {
        setVoterAddress(currentProfile?.ownedBy);
      }

      return res;
    })
  );

  const { data, isLoading, error, refetch } = useQuery(
    ['poll', proposalId, voterAddress],
    () => getSnapshotProposal(proposalId, voterAddress).then((res) => res),
    { enabled: !spaceLoading }
  );

  if (spaceLoading || isLoading) {
    // TODO: Add skeleton loader here
    return (
      <Wrapper>
        <div className="flex items-center justify-center">
          <Spinner size="xs" />
        </div>
      </Wrapper>
    );
  }

  if (!data.success || error) {
    return null;
  }

  const { proposal, votes } = data.poll;
  const isLensterPoll = proposal?.space?.id === LENSTER_POLLS_SPACE;

  if (!proposal) {
    return null;
  }

  if (isLensterPoll) {
    return (
      <span
        onClick={stopEventPropagation}
        data-testid={`poll-${proposal.id}`}
        aria-hidden="true"
      >
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
