import type { FC } from 'react';

const PublicationContentShimmer: FC = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="shimmer h-3 w-7/12 rounded-lg" />
        <div className="shimmer h-3 w-1/3 rounded-lg" />
      </div>
    </div>
  );
};

export default PublicationContentShimmer;
