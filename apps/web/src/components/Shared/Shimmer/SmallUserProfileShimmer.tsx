import type { FC } from "react";

import cn from "@hey/ui/cn";

interface SmallUserProfileShimmerProps {
  hideSlug?: boolean;
  smallAvatar?: boolean;
}

const SmallUserProfileShimmer: FC<SmallUserProfileShimmerProps> = ({
  hideSlug = false,
  smallAvatar = false
}) => {
  return (
    <div className="flex items-center space-x-3">
      <div
        className={cn(
          smallAvatar ? "size-4" : "size-6",
          "shimmer rounded-full"
        )}
      />
      <div className="shimmer h-3 w-28 rounded-lg" />
      {!hideSlug && <div className="shimmer h-3 w-20 rounded-lg" />}
    </div>
  );
};

export default SmallUserProfileShimmer;
