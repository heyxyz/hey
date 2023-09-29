import {
  CurrencyDollarIcon,
  QrCodeIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import humanize from '@hey/lib/humanize';
import type { BasePaintNft } from '@hey/types/nft';
import { Trans } from '@lingui/macro';
import { type FC } from 'react';
import { formatEther } from 'viem';

interface MetadataProps {
  canvas: BasePaintNft;
}

const Metadata: FC<MetadataProps> = ({ canvas }) => {
  return (
    <div className="space-y-1.5">
      {canvas.totalMints > 0 ? (
        <div className="flex items-center space-x-2">
          <UsersIcon className="lt-text-gray-500 h-4 w-4" />
          <b>
            <Trans>{humanize(canvas.totalMints)} minted</Trans>
          </b>
        </div>
      ) : null}
      {canvas.pixelsCount > 0 ? (
        <div className="flex items-center space-x-2">
          <QrCodeIcon className="lt-text-gray-500 h-4 w-4" />
          <b>
            <Trans>{humanize(canvas.pixelsCount)} pixels used</Trans>
          </b>
        </div>
      ) : null}
      {canvas.totalEarned ? (
        <div className="flex items-center space-x-2">
          <CurrencyDollarIcon className="lt-text-gray-500 h-4 w-4" />
          <b>
            <Trans>{formatEther(BigInt(canvas.totalEarned))} ETH earned</Trans>
          </b>
        </div>
      ) : null}
    </div>
  );
};

export default Metadata;
