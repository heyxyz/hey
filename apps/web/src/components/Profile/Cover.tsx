import type { FC } from 'react';

import { BRAND_COLOR, COVER, STATIC_IMAGES_URL } from '@hey/data/constants';
import imageKit from '@hey/lib/imageKit';
import sanitizeDStorageUrl from '@hey/lib/sanitizeDStorageUrl';

interface CoverProps {
  cover: string;
}

const Cover: FC<CoverProps> = ({ cover }) => {
  const hasCover = !cover.includes(STATIC_IMAGES_URL);

  return (
    <div
      className="h-52 sm:h-[350px]"
      style={{
        backgroundColor: BRAND_COLOR,
        backgroundImage: `url(${
          hasCover
            ? imageKit(sanitizeDStorageUrl(cover), COVER)
            : `${STATIC_IMAGES_URL}/patterns/2.svg`
        })`,
        backgroundPosition: 'center center',
        backgroundRepeat: hasCover ? 'no-repeat' : 'repeat',
        backgroundSize: hasCover ? 'cover' : '30%'
      }}
    />
  );
};

export default Cover;
