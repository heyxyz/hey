import type { FC } from 'react';

const TrendingTagShimmer: FC = () => {
  return (
    <div className="space-y-3 py-1">
      <div className="shimmer h-3 w-3/5 rounded-lg" />
      <div className="shimmer h-2.5 w-2/5 rounded-lg" />
    </div>
  );
};

export default TrendingTagShimmer;
