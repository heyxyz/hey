import { Card } from '@lenster/ui';

const NftGalleryShimmer = () => {
  return (
    <div>
      <div className="flex items-center justify-between space-y-2">
        <div className="shimmer h-6 w-1/4 rounded-lg" />
        <div className="shimmer h-6 w-6 rounded-lg" />
      </div>
      <div className="my-4 grid grid-cols-1 gap-4 py-5 sm:grid-cols-3">
        <Card>
          <div className="shimmer h-64 md:rounded-lg" />
        </Card>
        <Card>
          <div className="shimmer h-64 md:rounded-lg" />
        </Card>
        <Card>
          <div className="shimmer h-64 md:rounded-lg" />
        </Card>
        <Card>
          <div className="shimmer h-64 md:rounded-lg" />
        </Card>
        <Card>
          <div className="shimmer h-64 md:rounded-lg" />
        </Card>
        <Card>
          <div className="shimmer h-64 md:rounded-lg" />
        </Card>
      </div>
    </div>
  );
};

export default NftGalleryShimmer;
