import type { APITypes } from 'plyr-react';
import type { FC, Ref } from 'react';

// import Plyr from 'plyr-react';
// import 'plyr-react/plyr.css';
import { memo } from 'react';

interface PlayerProps {
  playerRef: Ref<APITypes>;
  src: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Player: FC<PlayerProps> = ({ playerRef, src }) => {
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <></>
    // <Plyr
    //   options={{
    //     controls: ['progress', 'current-time', 'mute', 'volume']
    //   }}
    //   ref={playerRef}
    //   source={{ sources: [{ src }], type: 'audio' }}
    // />
  );
};

export default memo(Player);
