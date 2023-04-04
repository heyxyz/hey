import type { FC, ReactNode } from 'react';
import { useProposalQuery } from 'snapshot';
import { webClient } from 'snapshot/apollo';
import { Card } from 'ui';

interface WrapperProps {
  children: ReactNode;
}

const Wrapper: FC<WrapperProps> = ({ children }) => <Card className="mt-5 p-5">{children}</Card>;

interface SnapshotProps {
  propsalId: string;
}

const Snapshot: FC<SnapshotProps> = ({ propsalId }) => {
  const { data, loading, error } = useProposalQuery({
    variables: { id: propsalId },
    client: webClient
  });

  if (loading) {
    return <Wrapper>Loading...</Wrapper>;
  }

  return <Wrapper>{JSON.stringify(data)}</Wrapper>;
};

export default Snapshot;
