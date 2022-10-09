import { Card } from '@components/UI/Card';
import type { FC } from 'react';

import PublicationShimmer from './PublicationShimmer';

const PublicationsShimmer: FC = () => {
  return (
    <Card className="divide-y-[1px] dark:divide-gray-700/80">
      <PublicationShimmer />
      <PublicationShimmer />
      <PublicationShimmer />
    </Card>
  );
};

export default PublicationsShimmer;
