import type { FC } from "react";

const ImagePublicationsShimmer: FC = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="shimmer h-80 rounded-xl" />
      ))}
    </div>
  );
};

export default ImagePublicationsShimmer;
