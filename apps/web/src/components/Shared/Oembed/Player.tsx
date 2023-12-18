import type { OG } from '@hey/types/misc';
import type { FC } from 'react';

interface PlayerProps {
  og: OG;
}

const Player: FC<PlayerProps> = ({ og }) => {
  return (
    <div className="mt-4 w-11/12 text-sm sm:w-5/6 ">
      <div
        className="oembed-player"
        dangerouslySetInnerHTML={{ __html: og.html as string }}
      />
    </div>
  );
};

export default Player;
