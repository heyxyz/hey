import type { FC } from 'react';
import type { OG } from 'src/types';

interface PlayerProps {
  og: OG;
}

const Player: FC<PlayerProps> = ({ og }) => {
  return (
    <div className="mt-4 w-5/6 text-sm">
      <div className="iframely-player" dangerouslySetInnerHTML={{ __html: og.html }} />
    </div>
  );
};

export default Player;
