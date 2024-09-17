import type { FC } from "react";

const PublicationShimmer: FC = () => {
  return (
    <div className="flex items-start space-x-3 px-5 py-4">
      <div>
        <div className="shimmer size-11 rounded-full" />
      </div>
      <div className="w-full space-y-4">
        <div className="item flex justify-between">
          <div className="item flex space-x-3 pt-1">
            <div className="shimmer h-3 w-28 rounded-lg" />
            <div className="shimmer h-3 w-20 rounded-lg" />
          </div>
          <div className="shimmer h-3 w-6 rounded-lg" />
        </div>
        <div className="space-y-2">
          <div className="shimmer h-3 w-7/12 rounded-lg" />
          <div className="shimmer h-3 w-1/3 rounded-lg" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-6 pt-1">
            <div className="shimmer size-5 rounded-lg" />
            <div className="shimmer size-5 rounded-lg" />
            <div className="shimmer size-5 rounded-lg" />
            <div className="shimmer size-5 rounded-lg" />
          </div>
          <div className="shimmer h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default PublicationShimmer;
