import 'plyr-react/plyr.css';

import imageProxy from 'lib/imageProxy';
import sanitizeDStorageUrl from 'lib/sanitizeDStorageUrl';
import Plyr from 'plyr-react';
import type { FC } from 'react';
import { memo } from 'react';

interface VideoProps {
  src: string;
  poster: string;
}

const Video: FC<VideoProps> = ({ src, poster }) => {
  return (
    <div className="rounded-lg" data-testid={`attachment-video-${src}`}>
      <Plyr
        source={{
          type: 'video',
          sources: [{ src, provider: 'html5' }],
          poster: poster ? imageProxy(sanitizeDStorageUrl(poster)) : src
        }}
        options={{
          controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
          ratio: '16:12'
        }}
      />
    </div>
  );
};

export default memo(Video);
