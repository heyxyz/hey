import type { Amount } from '@hey/lens';
import type { FC } from 'react';

import { STATIC_IMAGES_URL } from '@hey/data/constants';
import { PUBLICATION } from '@hey/data/tracking';
import getUniswapURL from '@hey/lib/getUniswapURL';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';

import WrapWmatic from './WrapWmatic';

interface NoBalanceErrorProps {
  moduleAmount: Amount;
}

const NoBalanceError: FC<NoBalanceErrorProps> = ({ moduleAmount }) => {
  const amount = moduleAmount?.value;
  const currency = moduleAmount?.asset?.symbol;
  const assetAddress = moduleAmount?.asset?.contract.address;

  if (currency === 'WMATIC') {
    return <WrapWmatic moduleAmount={moduleAmount} />;
  }

  return (
    <div className="space-y-1">
      <div className="text-sm">
        You don't have enough <b>{currency}</b>
      </div>
      <Link
        className="flex items-center space-x-1.5 text-xs font-bold text-pink-500"
        href={getUniswapURL(parseFloat(amount), assetAddress)}
        onClick={() => Leafwatch.track(PUBLICATION.COLLECT_MODULE.OPEN_UNISWAP)}
        rel="noreferrer noopener"
        target="_blank"
      >
        <img
          alt="Uniswap"
          className="size-5"
          height={20}
          src={`${STATIC_IMAGES_URL}/brands/uniswap.png`}
          width={20}
        />
        <div>Swap in Uniswap</div>
      </Link>
    </div>
  );
};

export default NoBalanceError;
