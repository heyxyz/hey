import type { FC } from 'react';

import {
  ARWEAVE_GATEWAY,
  IPFS_GATEWAY,
  VIDEO_THUMBNAIL
} from '@hey/data/constants';
import imageKit from '@hey/lib/imageKit';
import sanitizeDStorageUrl from '@hey/lib/sanitizeDStorageUrl';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import cn from '@hey/ui/cn';
import { Player } from '@livepeer/react';
import 'plyr-react/plyr.css';
import { memo } from 'react';
import useProfileStore from 'src/store/persisted/useProfileStore';

interface VideoProps {
  className?: string;
  poster?: string;
  src: string;
}

const Video: FC<VideoProps> = ({ className = '', poster, src }) => {
  const currentProfile = useProfileStore((state) => state.currentProfile);

  return (
    <div className={cn('lp-player', className)} onClick={stopEventPropagation}>
      <Player
        autoUrlUpload={{
          arweaveGateway: ARWEAVE_GATEWAY,
          fallback: true,
          ipfsGateway: IPFS_GATEWAY
        }}
        controls={{ defaultVolume: 1 }}
        objectFit="contain"
        poster={imageKit(sanitizeDStorageUrl(poster), VIDEO_THUMBNAIL)}
        refetchPlaybackInfoInterval={1000 * 60 * 60 * 24 * 7}
        showLoadingSpinner
        showPipButton={false}
        showUploadingIndicator
        src={src}
        viewerId={currentProfile?.ownedBy.address}
      />
    </div>
  );
};

export default memo(Video);
