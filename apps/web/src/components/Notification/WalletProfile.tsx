import { POLYGONSCAN_URL } from '@lenster/data/constants';
import type { Wallet } from '@lenster/lens';
import formatAddress from '@lenster/lib/formatAddress';
import getStampFyiURL from '@lenster/lib/getStampFyiURL';
import { Image } from '@lenster/ui';
import Link from 'next/link';
import type { FC } from 'react';

interface NotificationWalletProfileProps {
  wallet: Wallet;
}

export const NotificationWalletProfileAvatar: FC<
  NotificationWalletProfileProps
> = ({ wallet }) => {
  return (
    <Link
      href={`${POLYGONSCAN_URL}/address/${wallet?.address}`}
      target="_blank"
      rel="noreferrer noopener"
    >
      <Image
        onError={({ currentTarget }) => {
          currentTarget.src = getStampFyiURL(wallet?.address);
        }}
        src={getStampFyiURL(wallet?.address)}
        className="h-8 w-8 rounded-full border bg-gray-200 dark:border-gray-700"
        height={32}
        width={32}
        alt={wallet?.address}
      />
    </Link>
  );
};

export const NotificationWalletProfileName: FC<
  NotificationWalletProfileProps
> = ({ wallet }) => {
  return (
    <Link
      className="inline-flex items-center space-x-1 font-bold"
      href={`${POLYGONSCAN_URL}/address/${wallet?.address}`}
      target="_blank"
      rel="noreferrer noopener"
    >
      <div>{formatAddress(wallet?.address)}</div>
    </Link>
  );
};
