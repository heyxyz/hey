import type { FC } from 'react';

import { BRAND_COLOR, COVER, STATIC_IMAGES_URL } from '@hey/data/constants';
import imageKit from '@hey/lib/imageKit';
import sanitizeDStorageUrl from '@hey/lib/sanitizeDStorageUrl';

interface CoverProps {
  cover: string;
}

const Cover: FC<CoverProps> = ({ cover }) => {
  return (
    <div
      className="h-52 sm:h-80"
      style={{
        backgroundColor: BRAND_COLOR,
        backgroundImage: `url(${
          cover
            ? imageKit(sanitizeDStorageUrl(cover), COVER)
            : `${STATIC_IMAGES_URL}/patterns/2.svg`
        })`,
        backgroundPosition: 'center center',
        backgroundRepeat: cover ? 'no-repeat' : 'repeat',
        backgroundSize: cover ? 'cover' : '30%'
      }}
    />
  );
};

export default Cover;
