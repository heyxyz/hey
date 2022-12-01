import 'plyr-react/plyr.css';

import Plyr from 'plyr-react';
import type { FC } from 'react';

interface Props {
  src: string;
}

const Video: FC<Props> = ({ src }) => {
  return (
    <div className="rounded-lg">
      <Plyr
        source={{
          type: 'video',
          sources: [{ src, provider: 'html5' }],
          // TODO: get placeholder image
          poster: src
        }}
        options={{
          controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
          ratio: '16:12'
        }}
      />
    </div>
  );
};

export default Video;
