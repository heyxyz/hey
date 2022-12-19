import type { FC } from 'react';

const PublicationContentShimmer: FC = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="w-7/12 h-3 rounded-lg shimmer" />
        <div className="w-1/3 h-3 rounded-lg shimmer" />
      </div>
    </div>
  );
};

export default PublicationContentShimmer;
