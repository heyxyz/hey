import type { FC } from "react";

interface GraphStatsShimmerProps {
  count: number;
}

const GraphStatsShimmer: FC<GraphStatsShimmerProps> = ({ count }) => {
  return (
    <div className="flex gap-5 pb-1">
      {Array.from({ length: count }).map((_, index) => (
        <div className="space-y-2" key={index}>
          <div className="shimmer size-7 rounded-lg" />
          <div className="shimmer h-3 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  );
};

export default GraphStatsShimmer;
