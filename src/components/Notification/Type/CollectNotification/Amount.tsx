import type { NewCollectNotification } from '@generated/types';
import { CurrencyDollarIcon } from '@heroicons/react/outline';
import getTokenImage from '@lib/getTokenImage';
import humanize from '@lib/humanize';
import type { FC } from 'react';

interface Props {
  notification: NewCollectNotification;
}

const CollectedAmount: FC<Props> = ({ notification }) => {
  const collectModule: any = notification?.collectedPublication?.collectModule;

  return (
    <div className="flex items-center mt-2 space-x-1">
      <CurrencyDollarIcon className="text-green-500 h-[15px]" />
      {collectModule.__typename === 'FreeCollectModuleSettings' ? (
        <div className="text-[12px]">Collected for free</div>
      ) : (
        <>
          <div className="text-[12px]">
            Collected for {humanize(collectModule?.amount?.value)} {collectModule?.amount?.asset?.symbol}
          </div>
          <img
            className="w-5 h-5"
            height={20}
            width={20}
            src={getTokenImage(collectModule?.amount?.asset?.symbol)}
            alt={collectModule?.amount?.asset?.symbol}
          />
        </>
      )}
    </div>
  );
};

export default CollectedAmount;
