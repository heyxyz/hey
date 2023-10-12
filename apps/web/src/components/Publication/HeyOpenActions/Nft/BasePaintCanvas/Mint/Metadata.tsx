import {
  CurrencyDollarIcon,
  PaintBrushIcon,
  QrCodeIcon,
  SwatchIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import humanize from '@hey/lib/humanize';
import type { BasePaintCanvas } from '@hey/types/nft';
import { Trans } from '@lingui/macro';
import { type FC } from 'react';
import { formatEther } from 'viem';

interface MetadataProps {
  canvas: BasePaintCanvas;
}

const Metadata: FC<MetadataProps> = ({ canvas }) => {
  const { totalMints, pixelsCount, totalEarned, contributions } = canvas;

  return (
    <div className="space-y-1.5">
      {totalMints > 0 ? (
        <div className="flex items-center space-x-2">
          <UsersIcon className="lt-text-gray-500 h-4 w-4" />
          <b>
            <Trans>{humanize(totalMints)} minted</Trans>
          </b>
        </div>
      ) : null}
      <div className="flex items-center space-x-2">
        <PaintBrushIcon className="lt-text-gray-500 h-4 w-4" />
        <b>
          <Trans>
            {contributions.length > 1000 ? '1000+' : contributions.length}{' '}
            artists
          </Trans>
        </b>
      </div>
      {pixelsCount > 0 ? (
        <div className="flex items-center space-x-2">
          <QrCodeIcon className="lt-text-gray-500 h-4 w-4" />
          <b>
            <Trans>{humanize(pixelsCount)} pixels used</Trans>
          </b>
        </div>
      ) : null}
      {totalEarned ? (
        <div className="flex items-center space-x-2">
          <CurrencyDollarIcon className="lt-text-gray-500 h-4 w-4" />
          <b>
            <Trans>{formatEther(BigInt(totalEarned))} ETH earned</Trans>
          </b>
        </div>
      ) : null}
      <div className="flex items-center space-x-2">
        <SwatchIcon className="lt-text-gray-500 h-4 w-4" />
        <b>
          <Trans>Color Palette</Trans>
        </b>
        <div className="flex items-center space-x-1">
          {canvas.palette.map((color, index) => (
            <span
              key={index}
              className="inline-block h-4 w-4"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Metadata;
