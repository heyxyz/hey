import type { BasePaintCanvas } from '@hey/types/nft';
import type { FC } from 'react';

import {
  CurrencyDollarIcon,
  PaintBrushIcon,
  QrCodeIcon,
  SwatchIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import humanize from '@hey/lib/humanize';
import { formatEther } from 'viem';

interface MetadataProps {
  canvas: BasePaintCanvas;
}

const Metadata: FC<MetadataProps> = ({ canvas }) => {
  const { contributions, pixelsCount, totalEarned, totalMints } = canvas;

  return (
    <div className="space-y-1.5">
      {totalMints > 0 ? (
        <div className="flex items-center space-x-2">
          <UsersIcon className="ld-text-gray-500 size-4" />
          <b>{humanize(totalMints)} minted</b>
        </div>
      ) : null}
      <div className="flex items-center space-x-2">
        <PaintBrushIcon className="ld-text-gray-500 size-4" />
        <b>
          {contributions.length > 1000 ? '1000+' : contributions.length} artists
        </b>
      </div>
      {pixelsCount > 0 ? (
        <div className="flex items-center space-x-2">
          <QrCodeIcon className="ld-text-gray-500 size-4" />
          <b>{humanize(pixelsCount)} pixels used</b>
        </div>
      ) : null}
      {totalEarned ? (
        <div className="flex items-center space-x-2">
          <CurrencyDollarIcon className="ld-text-gray-500 size-4" />
          <b>{formatEther(BigInt(totalEarned))} ETH earned</b>
        </div>
      ) : null}
      <div className="flex items-center space-x-2">
        <SwatchIcon className="ld-text-gray-500 size-4" />
        <b>Color Palette</b>
        <div className="flex items-center space-x-1">
          {canvas.palette.map((color) => (
            <span
              className="inline-block size-4"
              key={color}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Metadata;
