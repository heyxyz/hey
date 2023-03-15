import { Image } from '@components/UI/Image';
import imageProxy from '@lib/imageProxy';
import { POLYGONSCAN_URL } from 'data/constants';
import type { Wallet } from 'lens';
import type { FC } from 'react';
import formatAddress from 'utils/formatAddress';
import getStampFyiURL from 'utils/getStampFyiURL';

interface NotificationWalletProfileProps {
  wallet: Wallet;
}

export const NotificationWalletProfileAvatar: FC<NotificationWalletProfileProps> = ({ wallet }) => {
  return (
    <a href={`${POLYGONSCAN_URL}/address/${wallet?.address}`} target="_blank" rel="noreferrer noopener">
      <Image
        onError={({ currentTarget }) => {
          currentTarget.src = getStampFyiURL(wallet?.address);
        }}
        src={imageProxy(getStampFyiURL(wallet?.address))}
        className="h-8 w-8 rounded-full border bg-gray-200 dark:border-gray-700"
        height={32}
        width={32}
        alt={wallet?.address}
      />
    </a>
  );
};

export const NotificationWalletProfileName: FC<NotificationWalletProfileProps> = ({ wallet }) => {
  return (
    <a
      className="inline-flex items-center space-x-1 font-bold"
      href={`${POLYGONSCAN_URL}/address/${wallet?.address}`}
      target="_blank"
      rel="noreferrer noopener"
    >
      <div>{formatAddress(wallet?.address)}</div>
    </a>
  );
};
