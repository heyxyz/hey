import type { OG } from '@good/types/misc';
import type { FC } from 'react';

interface PlayerProps {
  og: OG;
}

const Player: FC<PlayerProps> = ({ og }) => {
  return (
    <div className="mt-4 w-full text-sm">
      <div
        className="oembed-player"
        dangerouslySetInnerHTML={{ __html: og.html as string }}
      />
    </div>
  );
};

export default Player;
