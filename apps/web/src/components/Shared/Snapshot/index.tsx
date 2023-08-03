import { LENSTER_POLLS_SPACE } from '@lenster/data/constants';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import type { Proposal, Vote } from '@lenster/snapshot';
import { useProposalQuery } from '@lenster/snapshot';
import { snapshotApolloClient } from '@lenster/snapshot/apollo';
import { Spinner } from '@lenster/ui';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';

import Wrapper from '../Embed/Wrapper';
import Choices from './Choices';
import Header from './Header';

interface SnapshotProps {
  proposalId: string;
}

const Snapshot: FC<SnapshotProps> = ({ proposalId }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  const { data, loading, error, refetch } = useProposalQuery({
    client: snapshotApolloClient,
    variables: {
      id: proposalId,
      where: { proposal: proposalId, voter: currentProfile?.ownedBy }
    }
  });

  if (loading) {
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
