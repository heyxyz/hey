import type { APITypes } from 'plyr-react';
import type { FC, Ref } from 'react';

import dynamic from 'next/dynamic';
import { memo } from 'react';

const Plyr = dynamic(() => import('plyr-react'), {
  loading: () => <p>Loading...</p>
});

interface PlayerProps {
  playerRef: Ref<APITypes>;
  src: string;
}

const Player: FC<PlayerProps> = ({ playerRef, src }) => {
  return (
    <Plyr
      options={{
        controls: ['progress', 'current-time', 'mute', 'volume']
      }}
      ref={playerRef}
      source={{ sources: [{ src }], type: 'audio' }}
    />
  );
};

export default memo(Player);
