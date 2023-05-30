import { CurrencyDollarIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import type { NewCollectNotification } from 'lens';
import getTokenImage from 'lib/getTokenImage';
import humanize from 'lib/humanize';
import type { FC } from 'react';

interface CollectedAmountProps {
  notification: NewCollectNotification;
}

const CollectedAmount: FC<CollectedAmountProps> = ({ notification }) => {
  const collectModule: any = notification?.collectedPublication?.collectModule;
  const amount =
    collectModule?.amount?.value ?? collectModule?.fee?.amount?.value;
  const currency =
    collectModule?.amount?.asset?.symbol ??
    collectModule?.fee?.amount?.asset?.symbol;

  return (
    <div className="mt-2 flex items-center space-x-1">
      <CurrencyDollarIcon className="h-[15px] text-green-500" />
      {!Boolean(amount) ? (
        <div className="text-[12px]">Collected for free</div>
      ) : (
        <>
          <div className="text-[12px]">
            <Trans>
              Collected for {humanize(parseFloat(amount))} {currency}
            </Trans>
          </div>
          <img
            className="h-5 w-5"
            height={20}
            width={20}
            src={getTokenImage(currency)}
            alt={currency}
          />
        </>
      )}
    </div>
  );
};

export default CollectedAmount;
