import { CurrencyDollarIcon } from '@heroicons/react/outline';
import getTokenImage from '@lib/getTokenImage';
import humanize from '@lib/humanize';
import { Trans } from '@lingui/macro';
import type { NewCollectNotification } from 'lens';
import type { FC } from 'react';

interface Props {
  notification: NewCollectNotification;
}

const CollectedAmount: FC<Props> = ({ notification }) => {
  const collectModule: any = notification?.collectedPublication?.collectModule;

  return (
    <div className="mt-2 flex items-center space-x-1">
      <CurrencyDollarIcon className="h-[15px] text-green-500" />
      {collectModule.__typename === 'FreeCollectModuleSettings' ? (
        <div className="text-[12px]">Collected for free</div>
      ) : (
        <>
          <div className="text-[12px]">
            <Trans>
              Collected for {humanize(collectModule?.amount?.value)} {collectModule?.amount?.asset?.symbol}
            </Trans>
          </div>
          <img
            className="h-5 w-5"
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
