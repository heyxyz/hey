import 'plyr-react/plyr.css';

import imageKit from '@hey/lib/imageKit';
import sanitizeDStorageUrl from '@hey/lib/sanitizeDStorageUrl';
import cn from '@hey/ui/cn';
import { Player } from '@livepeer/react';
import type { FC } from 'react';
import { memo } from 'react';

interface VideoProps {
  src: string;
  poster?: string;
  className?: string;
}

const Video: FC<VideoProps> = ({ src, poster, className = '' }) => {
  return (
    <div
      className={cn('lp-player', className)}
      data-testid={`attachment-video-${src}`}
    >
      <Player
        src={src}
        poster={imageKit(sanitizeDStorageUrl(poster))}
        objectFit="contain"
        showLoadingSpinner
        showPipButton={false}
        showUploadingIndicator={false}
        controls={{ defaultVolume: 1 }}
      />
    </div>
  );
};

export default memo(Video);
