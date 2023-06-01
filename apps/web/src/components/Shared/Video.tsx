import 'plyr-react/plyr.css';

import { Player } from '@livepeer/react';
import { IPFS_GATEWAY } from '@lenster/data';
import imageKit from 'lib/imageKit';
import sanitizeDStorageUrl from 'lib/sanitizeDStorageUrl';
import type { FC } from 'react';
import { memo } from 'react';

interface VideoProps {
  src: string;
  poster: string;
}

const Video: FC<VideoProps> = ({ src, poster }) => {
  return (
    <div className="lp-player" data-testid={`attachment-video-${src}`}>
      <Player
        src={src}
        poster={imageKit(sanitizeDStorageUrl(poster))}
        objectFit="contain"
        showLoadingSpinner
        showPipButton={false}
        showUploadingIndicator={false}
        controls={{ defaultVolume: 1 }}
        autoUrlUpload={{ fallback: true, ipfsGateway: IPFS_GATEWAY }}
      />
    </div>
  );
};

export default memo(Video);
