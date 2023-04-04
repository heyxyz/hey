import type { FC } from 'react';

interface SnapshotProps {
  propsalId: string;
}

const Snapshot: FC<SnapshotProps> = ({ propsalId }) => {
  return <div>Snapshot - {propsalId}</div>;
};

export default Snapshot;
