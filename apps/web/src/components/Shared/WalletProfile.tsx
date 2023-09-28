import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { POLYGONSCAN_URL } from '@hey/data/constants';
import type { Wallet } from '@hey/lens';
import formatAddress from '@hey/lib/formatAddress';
import getStampFyiURL from '@hey/lib/getStampFyiURL';
import imageKit from '@hey/lib/imageKit';
import { Image } from '@hey/ui';
import Link from 'next/link';
import type { FC } from 'react';
import useEnsName from 'src/hooks/useEnsName';

import Slug from './Slug';

interface WalletProfileProps {
  wallet: Wallet;
}

const WalletProfile: FC<WalletProfileProps> = ({ wallet }) => {
  const { ens, loading } = useEnsName({
    address: wallet?.address,
    enabled: Boolean(wallet?.address)
  });

  return (
    <div className="flex items-center justify-between">
      <Link
        href={`${POLYGONSCAN_URL}/address/${wallet?.address}`}
        className="flex items-center space-x-3"
        target="_blank"
        rel="noreferrer noopener"
      >
        <Image
          onError={({ currentTarget }) => {
            currentTarget.src = getStampFyiURL(wallet?.address);
          }}
          src={imageKit(getStampFyiURL(wallet?.address))}
          className="h-10 w-10 rounded-full border bg-gray-200"
          height={40}
          width={40}
          alt={wallet?.address}
        />
        <div>
          <div className="flex items-center gap-1.5">
            <div>
              {loading ? formatAddress(wallet?.address) : formatAddress(ens)}
            </div>
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </div>
          <Slug className="text-sm" slug={formatAddress(wallet?.address)} />
        </div>
      </Link>
    </div>
  );
};

export default WalletProfile;
