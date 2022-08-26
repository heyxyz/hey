import 'plyr-react/plyr.css';

import Plyr, { APITypes } from 'plyr-react';
import React, { FC, useEffect, useRef } from 'react';

interface Props {
  src: string;
}

const Video: FC<Props> = ({ src }) => {
  const videoRef = useRef<APITypes>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Pause the video when not in view
  useEffect(() => {
    const handlePlay = (entries: any) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          (videoRef.current?.plyr as Plyr)?.pause();
        }
      }
    };

    const observer = new IntersectionObserver(handlePlay, {
      threshold: [0.25, 0.75]
    });

    if (wrapperRef.current) {
      observer.observe(wrapperRef?.current);
    }
  }, []);

  return (
    <div ref={wrapperRef} className="rounded-lg">
      <Plyr
        ref={videoRef}
        source={{
          type: 'video',
          sources: [{ src, provider: 'html5' }],
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
