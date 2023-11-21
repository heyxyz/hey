import { HEY_POLLS_SPACE } from '@hey/data/constants';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import type { Proposal, Vote } from '@hey/snapshot';
import { useProposalQuery } from '@hey/snapshot';
import { snapshotApolloClient } from '@hey/snapshot/apollo';
import type { SnapshotMetadata } from '@hey/types/embed';
import { Spinner } from '@hey/ui';
import { type FC } from 'react';
import useProfileStore from 'src/store/persisted/useProfileStore';

import Wrapper from '../../../../Shared/Embed/Wrapper';
import Choices from './Choices';
import Header from './Header';

interface SnapshotProps {
  embedMetadata: SnapshotMetadata;
}

const Snapshot: FC<SnapshotProps> = ({ embedMetadata }) => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const { proposal: proposalId } = embedMetadata;

  const { data, loading, error, refetch } = useProposalQuery({
    client: snapshotApolloClient,
    variables: {
      id: proposalId,
      where: { proposal: proposalId, voter: currentProfile?.ownedBy.address }
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
      <span onClick={stopEventPropagation}>
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
    <Wrapper>
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
