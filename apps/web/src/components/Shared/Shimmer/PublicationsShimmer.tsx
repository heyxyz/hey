import { Card } from '@components/UI/Card';
import clsx from 'clsx';
import type { FC } from 'react';

import PublicationShimmer from './PublicationShimmer';

interface Props {
  inVirtualList?: boolean;
}

const PublicationsShimmer: FC<Props> = ({ inVirtualList = false }) => {
  return (
    <Card
      className={clsx(
        { 'border-none rounded-none': inVirtualList },
        'divide-y-[1px] dark:divide-gray-700/80'
      )}
    >
      <PublicationShimmer />
      <PublicationShimmer />
      <PublicationShimmer />
    </Card>
  );
};

export default PublicationsShimmer;
