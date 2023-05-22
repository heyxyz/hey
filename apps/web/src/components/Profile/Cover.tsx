import { COVER, STATIC_IMAGES_URL } from 'data/constants';
import imageKit from 'lib/imageKit';
import sanitizeDStorageUrl from 'lib/sanitizeDStorageUrl';
import type { FC } from 'react';
import colors from 'tailwindcss/colors';

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
        backgroundColor: colors.violet[500],
        backgroundSize: cover ? 'cover' : '30%',
        backgroundPosition: 'center center',
        backgroundRepeat: cover ? 'no-repeat' : 'repeat'
      }}
    />
  );
};

export default Cover;
