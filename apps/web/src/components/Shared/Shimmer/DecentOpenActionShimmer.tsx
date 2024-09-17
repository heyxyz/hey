import type { FC } from "react";

const DecentOpenActionShimmer: FC = () => {
  return (
    <div className="flex items-center space-x-2 border-t px-4 py-2 dark:border-gray-700">
      <div className="shimmer size-5 rounded-full" />
      <div className="flex w-full items-center justify-between">
        <div className="shimmer h-3 w-24 rounded-lg" />
        <div className="shimmer h-[30px] w-[85px] rounded-full" />
      </div>
    </div>
  );
};

export default DecentOpenActionShimmer;
