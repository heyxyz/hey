import { BRAND_COLOR, COVER, STATIC_IMAGES_URL } from '@hey/data/constants';
import imageKit from '@hey/lib/imageKit';
import sanitizeDStorageUrl from '@hey/lib/sanitizeDStorageUrl';
import type { FC } from 'react';

interface CoverProps {
  cover: string;
}

const Cover: FC<CoverProps> = ({ cover }) => {
  return (
    <div
      className="h-52 sm:h-80"
      data-testid="profile-cover"
      style={{
        backgroundImage: `url(${
          cover
            ? imageKit(sanitizeDStorageUrl(cover), COVER)
            : `${STATIC_IMAGES_URL}/patterns/2.svg`
        })`,
        backgroundColor: BRAND_COLOR,
        backgroundSize: cover ? 'cover' : '30%',
        backgroundPosition: 'center center',
        backgroundRepeat: cover ? 'no-repeat' : 'repeat'
      }}
    />
  );
};

export default Cover;
