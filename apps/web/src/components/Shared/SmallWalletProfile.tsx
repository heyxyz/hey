import type { FC } from 'react';
import type { Address } from 'viem';

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { POLYGONSCAN_URL } from '@hey/data/constants';
import formatAddress from '@hey/lib/formatAddress';
import getStampFyiURL from '@hey/lib/getStampFyiURL';
import imageKit from '@hey/lib/imageKit';
import { Image } from '@hey/ui';
import cn from '@hey/ui/cn';
import Link from 'next/link';
import useEnsName from 'src/hooks/useEnsName';

interface SmallWalletProfileProps {
  address: Address;
  smallAvatar?: boolean;
}

const SmallWalletProfile: FC<SmallWalletProfileProps> = ({
  address,
  smallAvatar
}) => {
  const { ens, loading } = useEnsName({ address, enabled: Boolean(address) });

  return (
    <div className="flex items-center justify-between">
      <Link
        className="flex items-center space-x-2"
        href={`${POLYGONSCAN_URL}/address/${address}`}
        rel="noreferrer noopener"
        target="_blank"
      >
        <Image
          alt={address}
          className={cn(
            smallAvatar ? 'size-5' : 'size-6',
            'rounded-full border bg-gray-200 dark:border-gray-700'
          )}
          height={smallAvatar ? 20 : 24}
          onError={({ currentTarget }) => {
            currentTarget.src = getStampFyiURL(address);
          }}
          src={imageKit(getStampFyiURL(address))}
          width={smallAvatar ? 20 : 24}
        />
        <div>
          <div className="flex items-center gap-1.5">
            <div>{loading ? formatAddress(address) : formatAddress(ens)}</div>
            <ArrowTopRightOnSquareIcon className="size-4" />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SmallWalletProfile;
