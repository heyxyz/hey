import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { POLYGONSCAN_URL } from '@hey/data/constants';
import formatAddress from '@hey/lib/formatAddress';
import getStampFyiURL from '@hey/lib/getStampFyiURL';
import imageKit from '@hey/lib/imageKit';
import { Image } from '@hey/ui';
import Link from 'next/link';
import { type FC, memo } from 'react';
import useEnsName from 'src/hooks/useEnsName';
import type { Address } from 'viem';

import Slug from './Slug';

interface WalletProfileProps {
  address: Address;
}

const WalletProfile: FC<WalletProfileProps> = ({ address }) => {
  const { ens, loading } = useEnsName({
    address,
    enabled: Boolean(address)
  });

  return (
    <div className="flex items-center justify-between">
      <Link
        href={`${POLYGONSCAN_URL}/address/${address}`}
        className="flex items-center space-x-3"
        target="_blank"
        rel="noreferrer noopener"
      >
        <Image
          onError={({ currentTarget }) => {
            currentTarget.src = getStampFyiURL(address);
          }}
          src={imageKit(getStampFyiURL(address))}
          className="h-10 w-10 rounded-full border bg-gray-200"
          height={40}
          width={40}
          alt={address}
        />
        <div>
          <div className="flex items-center gap-1.5">
            <div>{loading ? formatAddress(address) : formatAddress(ens)}</div>
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </div>
          <Slug className="text-sm" slug={formatAddress(address)} />
        </div>
      </Link>
    </div>
  );
};

export default memo(WalletProfile);
