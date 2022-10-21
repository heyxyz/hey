import getIPFSLink from '@lib/getIPFSLink';
import imageProxy from '@lib/imageProxy';
import type { FC } from 'react';
import { COVER, STATIC_ASSETS } from 'src/constants';

interface Props {
  cover: string;
}

const Cover: FC<Props> = ({ cover }) => {
  return (
    <div
      className="h-52 sm:h-80"
      style={{
        backgroundImage: `url(${
          cover ? imageProxy(getIPFSLink(cover), COVER) : `${STATIC_ASSETS}/patterns/2.svg`
        })`,
        backgroundColor: '#8b5cf6',
        backgroundSize: cover ? 'cover' : '30%',
        backgroundPosition: 'center center',
        backgroundRepeat: cover ? 'no-repeat' : 'repeat'
      }}
    />
  );
};

export default Cover;
