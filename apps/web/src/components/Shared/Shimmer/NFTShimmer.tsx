import { Card } from '@components/UI/Card';
import type { FC } from 'react';

const NFTShimmer: FC = () => {
  return (
    <Card>
      <div className="shimmer h-52 space-y-4 sm:h-80 md:rounded-t-[10px]" />
      <div className="space-y-2 border-t p-5 dark:border-gray-700">
        <div className="shimmer h-3 w-7/12 rounded-lg" />
        <div className="shimmer h-3 w-1/3 rounded-lg" />
      </div>
    </Card>
  );
};

export default NFTShimmer;
