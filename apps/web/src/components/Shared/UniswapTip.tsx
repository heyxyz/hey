import { Trans } from '@lingui/macro';
import { STATIC_IMAGES_URL } from 'data/constants';
import getUniswapURL from 'lib/getUniswapURL';
import type { FC } from 'react';

interface UniswapProps {
  roundInfo: any;
  tipAmount: string;
}

const Uniswap: FC<UniswapProps> = ({ roundInfo, tipAmount }) => {
  return (
    <div className="space-y-1">
      <div className="text-sm">
        {/* <Trans>
          You don't have enough <b>{roundInfo?.amount?.asset?.symbol}</b>
        </Trans> */}
        <Trans>You don't have enough wmatic</Trans>
      </div>
      <a
        href={getUniswapURL(parseFloat(tipAmount), roundInfo.token)}
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
        <div>
          <Trans>Swap in Uniswap</Trans>
        </div>
      </a>
    </div>
  );
};

export default Uniswap;
