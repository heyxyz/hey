import type { MirrorablePublication } from '@hey/lens';
import type { FC } from 'react';

interface ReportsProps {
  publication: MirrorablePublication;
}

const Reports: FC<ReportsProps> = ({ publication }) => {
  return <div className="p-5">{publication.id}</div>;
};

export default Reports;
