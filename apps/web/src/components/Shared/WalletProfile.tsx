import type { FC } from 'react';
import type { Address } from 'viem';

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { POLYGONSCAN_URL } from '@hey/data/constants';
import formatAddress from '@hey/lib/formatAddress';
import getStampFyiURL from '@hey/lib/getStampFyiURL';
import imageKit from '@hey/lib/imageKit';
import { Image } from '@hey/ui';
import Link from 'next/link';
import useEnsName from 'src/hooks/useEnsName';

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
        className="flex items-center space-x-3"
        href={`${POLYGONSCAN_URL}/address/${address}`}
        rel="noreferrer noopener"
        target="_blank"
      >
        <Image
          alt={address}
          className="size-10 rounded-full border bg-gray-200"
          height={40}
          onError={({ currentTarget }) => {
            currentTarget.src = getStampFyiURL(address);
          }}
          src={imageKit(getStampFyiURL(address))}
          width={40}
        />
        <div>
          <div className="flex items-center gap-1.5">
            <div>{loading ? formatAddress(address) : formatAddress(ens)}</div>
            <ArrowTopRightOnSquareIcon className="size-4" />
          </div>
          <Slug className="text-sm" slug={formatAddress(address)} />
        </div>
      </Link>
    </div>
  );
};

export default WalletProfile;
