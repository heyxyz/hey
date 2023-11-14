import type { OG } from '@hey/types/misc';
import { type FC } from 'react';

interface PlayerProps {
  og: OG;
}

const Player: FC<PlayerProps> = ({ og }) => {
  return (
    <div className="oembed-player·w-5/6·text-sm">
      <div
        className="oembed-player"
        dangerouslySetInnerHTML={{ __html: og.html as string }}
      />
    </div>
  );
};

export default Player;
