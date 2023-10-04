import { HEY_POLLS_SPACE } from '@hey/data/constants';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import type { Proposal, Vote } from '@hey/snapshot';
import { useProposalQuery } from '@hey/snapshot';
import { snapshotApolloClient } from '@hey/snapshot/apollo';
import { Spinner } from '@hey/ui';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';

import Wrapper from '../../../Shared/Embed/Wrapper';
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
  const isHeyPoll = proposal?.space?.id === HEY_POLLS_SPACE;

  if (!proposal) {
    return null;
  }

  if (isHeyPoll) {
    return (
      <span
        onClick={stopEventPropagation}
        data-testid={`poll-${proposal.id}`}
        aria-hidden="true"
      >
        <Choices
          proposal={proposal as Proposal}
          votes={votes as Vote[]}
          isHeyPoll={isHeyPoll}
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
