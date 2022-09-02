import { FC } from 'react';

const TrendingTagShimmer: FC = () => {
  return (
    <div className="py-1 space-y-3">
      <div className="w-3/5 h-3 rounded-lg shimmer" />
      <div className="w-2/5 h-2.5 rounded-lg shimmer" />
    </div>
  );
};

export default TrendingTagShimmer;
