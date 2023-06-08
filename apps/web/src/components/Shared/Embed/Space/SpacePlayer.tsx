import type { Publication } from '@lenster/lens';
import type { FC } from 'react';

interface SpacePlayerProps {
  publication: Publication;
  space: any;
}

const SpacePlayer: FC<SpacePlayerProps> = ({ publication, space }) => {
  const { metadata } = publication;

  return <div className="p-5">gm</div>;
};

export default SpacePlayer;
