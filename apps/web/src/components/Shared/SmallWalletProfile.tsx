import { ExternalLinkIcon } from '@heroicons/react/outline';
import { POLYGONSCAN_URL } from '@lenster/data/constants';
import type { Wallet } from '@lenster/lens';
import formatAddress from '@lenster/lib/formatAddress';
import getStampFyiURL from '@lenster/lib/getStampFyiURL';
import imageKit from '@lenster/lib/imageKit';
import { Image } from '@lenster/ui';
import cn from '@lenster/ui/cn';
import Link from 'next/link';
import type { FC } from 'react';
import useEnsName from 'src/hooks/useEnsName';

interface SmallWalletProfileProps {
  wallet: Wallet;
  smallAvatar?: boolean;
}

const SmallWalletProfile: FC<SmallWalletProfileProps> = ({
  wallet,
  smallAvatar
}) => {
  const { ens, loading } = useEnsName({
    address: wallet?.address,
    enabled: Boolean(wallet?.address)
  });

  return (
    <div className="flex items-center justify-between">
      <Link
        href={`${POLYGONSCAN_URL}/address/${wallet?.address}`}
        className="flex items-center space-x-2"
        target="_blank"
        rel="noreferrer noopener"
      >
        <Image
          onError={({ currentTarget }) => {
            currentTarget.src = getStampFyiURL(wallet?.address);
          }}
          src={imageKit(getStampFyiURL(wallet?.address))}
          className={cn(
            smallAvatar ? 'h-5 w-5' : 'h-6 w-6',
            'rounded-full border bg-gray-200 dark:border-gray-700'
          )}
          height={smallAvatar ? 20 : 24}
          width={smallAvatar ? 20 : 24}
          alt={wallet?.address}
        />
        <div>
          <div className="flex items-center gap-1.5">
            <div>
              {loading ? formatAddress(wallet?.address) : formatAddress(ens)}
            </div>
            <ExternalLinkIcon className="h-4 w-4" />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SmallWalletProfile;
