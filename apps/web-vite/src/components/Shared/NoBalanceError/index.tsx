import { STATIC_IMAGES_URL } from '@hey/data/constants';
import { PUBLICATION } from '@hey/data/tracking';
import type { Amount } from '@hey/lens';
import getUniswapURL from '@hey/lib/getUniswapURL';
import { Leafwatch } from '@lib/leafwatch';
import { Link } from 'react-router-dom';
import { type FC } from 'react';

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
        to={getUniswapURL(parseFloat(amount), assetAddress)}
        onClick={() => Leafwatch.track(PUBLICATION.COLLECT_MODULE.OPEN_UNISWAP)}
        className="flex items-center space-x-1.5 text-xs font-bold text-pink-500"
        target="_blank"
        rel="noreferrer noopener"
      >
        <img
          src={`${STATIC_IMAGES_URL}/brands/uniswap.png`}
          className="h-5 w-5"
          height={20}
          width={20}
          alt="Uniswap"
        />
        <div>Swap in Uniswap</div>
      </Link>
    </div>
  );
};

export default NoBalanceError;
