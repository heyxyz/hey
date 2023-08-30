import { THUMBNAIL_GENERATE_COUNT } from '@components/Composer/ChooseThumbnail';
import { For } from 'million/react';
import { useMemo } from 'react';

const ThumbnailsShimmer = () => {
  const thumbnails = useMemo(() => Array(THUMBNAIL_GENERATE_COUNT).fill(1), []);

  return (
    <For each={thumbnails} as="div">
      {(e, i) => <div key={`${e}_${i}`} className="shimmer rounded-lg" />}
    </For>
  );
};

export default ThumbnailsShimmer;
