import { stopEventPropagation } from 'lib/stopEventPropagation';
import type { FC, ReactNode } from 'react';
import type { Proposal } from 'snapshot';
import { useProposalQuery } from 'snapshot';
import { webClient } from 'snapshot/apollo';
import { Card, Spinner } from 'ui';

import Choices from './Choices';
import Header from './Header';

interface WrapperProps {
  children: ReactNode;
}

const Wrapper: FC<WrapperProps> = ({ children }) => (
  <Card className="mt-3 cursor-auto p-5" onClick={stopEventPropagation}>
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

  const { proposal } = data;

  return (
    <Wrapper>
      <Header proposal={proposal as Proposal} />
      <Choices proposal={proposal as Proposal} />
    </Wrapper>
  );
};

export default Snapshot;
