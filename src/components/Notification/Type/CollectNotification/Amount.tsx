import { NewCollectNotification } from '@generated/types';
import { CurrencyDollarIcon, HandIcon } from '@heroicons/react/outline';
import getTokenImage from '@lib/getTokenImage';
import humanize from '@lib/humanize';
import React, { FC } from 'react';

interface Props {
  notification: NewCollectNotification;
}

const CollectedAmount: FC<Props> = ({ notification }) => {
  const publicationType =
    notification?.collectedPublication?.metadata?.attributes[0]?.value ??
    notification?.collectedPublication?.__typename?.toLowerCase();
  const collectModule = notification?.collectedPublication?.collectModule;
  const hasAmount = 'amount' in collectModule;

  return (
    <div className="flex items-center mt-2 space-x-1">
      {publicationType === 'crowdfund' ? (
        <HandIcon className="text-green-500 h-[15px]" />
      ) : (
        <CurrencyDollarIcon className="text-green-500 h-[15px]" />
      )}
      {collectModule?.__typename === 'FreeCollectModuleSettings' ? (
        <div className="text-[12px]">Collected for free</div>
      ) : null}
      {hasAmount ? (
        <>
          <div className="text-[12px]">
            {publicationType === 'crowdfund' ? 'Funded' : 'Collected for'}{' '}
            {humanize(Number(collectModule?.amount?.value))} {collectModule?.amount?.asset?.symbol}
          </div>
          <img
            className="w-5 h-5"
            height={20}
            width={20}
            src={getTokenImage(collectModule?.amount?.asset?.symbol)}
            alt={collectModule?.amount?.asset?.symbol}
          />
        </>
      ) : null}
    </div>
  );
};

export default CollectedAmount;
