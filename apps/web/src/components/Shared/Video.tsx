import getIPFSLink from '@lib/getIPFSLink';
import imageProxy from '@lib/imageProxy';
import { Player } from '@livepeer/react';
import { IPFS_GATEWAY } from 'data/constants';
import type { FC } from 'react';

interface Props {
  src: string;
  poster: string;
}

const Video: FC<Props> = ({ src, poster }) => {
  return (
    <div className="rounded-lg">
      <Player
        src={src}
        poster={imageProxy(getIPFSLink(poster))}
        showTitle={false}
        objectFit="contain"
        showLoadingSpinner={false}
        showPipButton={false}
        showUploadingIndicator={false}
        controls={{ defaultVolume: 1 }}
        autoUrlUpload={{ fallback: true, ipfsGateway: IPFS_GATEWAY }}
      />
    </div>
  );
};

export default Video;
