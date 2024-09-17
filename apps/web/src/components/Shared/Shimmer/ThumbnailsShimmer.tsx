import { THUMBNAIL_GENERATE_COUNT } from "@components/Composer/ChooseThumbnail";
import { useMemo } from "react";

const ThumbnailsShimmer = () => {
  const thumbnails = useMemo(() => Array(THUMBNAIL_GENERATE_COUNT).fill(1), []);

  return (
    <>
      {thumbnails.map((e, i) => (
        <div className="shimmer rounded-lg" key={`${e}_${i}`} />
      ))}
    </>
  );
};

export default ThumbnailsShimmer;
