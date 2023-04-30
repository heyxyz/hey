import { LENSTER_POLLS_SPACE } from 'data';
import { stopEventPropagation } from 'lib/stopEventPropagation';
import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import { useInView } from 'react-cool-inview';
import type { Proposal, Vote } from 'snapshot';
import { useSnapshotQuery } from 'snapshot';
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
  propsalId: string;
}

const Snapshot: FC<SnapshotProps> = ({ propsalId }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [pollInterval, setPollInterval] = useState(0);
  const { observe, inView } = useInView();

  const { data, loading, error, refetch } = useSnapshotQuery({
    variables: {
      id: propsalId,
      where: { voter: currentProfile?.ownedBy ?? null, proposal: propsalId }
    },
    pollInterval: inView ? pollInterval : 0,
    client: webClient,
    onCompleted: (data) => {
      if (data.proposal?.state === 'active') {
        setPollInterval(5000);
      }
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

  if (isLensterPoll) {
    return (
      <Choices
        proposal={proposal as Proposal}
        votes={votes as Vote[]}
        isLensterPoll={isLensterPoll}
        refetch={refetch}
      />
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
