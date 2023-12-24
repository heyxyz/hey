import type { OG } from '@hey/types/misc';
import type { FC } from 'react';

import cn from '@hey/ui/cn';

interface PlayerProps {
  className?: string;
  og: OG;
}

const Player: FC<PlayerProps> = ({ className, og }) => {
  return (
    <div className={cn('mt-4 w-5/6 text-sm', className)}>
      <div
        className="oembed-player"
        dangerouslySetInnerHTML={{ __html: og.html as string }}
      />
    </div>
  );
};

export default Player;
