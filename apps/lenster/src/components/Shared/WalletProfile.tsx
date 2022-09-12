import { Wallet } from '@generated/types';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import formatAddress from '@lib/formatAddress';
import getStampFyiURL from '@lib/getStampFyiURL';
import imagekitURL from '@lib/imagekitURL';
import React, { FC } from 'react';
import { POLYGONSCAN_URL } from 'src/constants';

import Slug from './Slug';

interface Props {
  wallet: Wallet;
}

const WalletProfile: FC<Props> = ({ wallet }) => {
  return (
    <div className="flex justify-between items-center">
      <a
        href={`${POLYGONSCAN_URL}/address/${wallet?.address}`}
        className="flex items-center space-x-3"
        target="_blank"
        rel="noreferrer noopener"
      >
        <img
          src={imagekitURL(getStampFyiURL(wallet?.address), 'avatar')}
          className="w-10 h-10 bg-gray-200 rounded-full border"
          height={40}
          width={40}
          alt={wallet?.address}
        />
        <div>
          <div className="flex gap-1.5 items-center">
            <div>{formatAddress(wallet?.address)}</div>
            <ExternalLinkIcon className="w-4 h-4" />
          </div>
          <Slug className="text-sm" slug={formatAddress(wallet?.address)} />
        </div>
      </a>
    </div>
  );
};

export default WalletProfile;
