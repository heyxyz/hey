import { Card } from '@hey/ui';
import type { FC } from 'react';

const NftShimmer: FC = () => {
  return (
    <Card className="mt-3" forceRounded>
      <div className="shimmer h-[400px] w-full rounded-t-xl" />
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center space-x-2">
          <div className="shimmer h-5 w-5 rounded-full" />
          <div className="shimmer h-3 w-40 rounded-xl" />
        </div>
        <div className="shimmer h-[30px] w-[78px] rounded-lg" />
      </div>
    </Card>
  );
};

export default NftShimmer;
