'use client';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import { POLYGONSCAN_URL } from 'data/constants';
import type { Wallet } from 'lens';
import formatAddress from 'lib/formatAddress';
import getStampFyiURL from 'lib/getStampFyiURL';
import imageProxy from 'lib/imageProxy';
import type { FC } from 'react';
import { Image } from 'ui';

import Slug from './Slug';

interface WalletProfileProps {
  wallet: Wallet;
}

const WalletProfile: FC<WalletProfileProps> = ({ wallet }) => {
  return (
    <div className="flex items-center justify-between">
      <a
        href={`${POLYGONSCAN_URL}/address/${wallet?.address}`}
        className="flex items-center space-x-3"
        target="_blank"
        rel="noreferrer noopener"
      >
        <Image
          onError={({ currentTarget }) => {
            currentTarget.src = getStampFyiURL(wallet?.address);
          }}
          src={imageProxy(getStampFyiURL(wallet?.address))}
          className="h-10 w-10 rounded-full border bg-gray-200"
          height={40}
          width={40}
          alt={wallet?.address}
        />
        <div>
          <div className="flex items-center gap-1.5">
            <div>{formatAddress(wallet?.address)}</div>
            <ExternalLinkIcon className="h-4 w-4" />
          </div>
          <Slug className="text-sm" slug={formatAddress(wallet?.address)} />
        </div>
      </a>
    </div>
  );
};

export default WalletProfile;
