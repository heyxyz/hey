import type { LensterCollectModule, LensterFollowModule } from '@generated/lenstertypes';
import { BirdStats } from '@lib/birdstats';
import getUniswapURL from '@lib/getUniswapURL';
import type { FC } from 'react';
import { STATIC_ASSETS } from 'src/constants';
import { PUBLICATION } from 'src/tracking';

interface Props {
  module: LensterCollectModule | LensterFollowModule;
}

const Uniswap: FC<Props> = ({ module }) => {
  return (
    <div className="space-y-1">
      <div className="text-sm">
        You don't have enough <b>{module?.amount?.asset?.symbol}</b>
      </div>
      <a
        href={getUniswapURL(parseFloat(module?.amount?.value), module?.amount?.asset?.address)}
        onClick={() => {
          BirdStats.track(PUBLICATION.COLLECT_MODULE.OPEN_UNISWAP);
        }}
        className="flex items-center space-x-1.5 text-xs font-bold text-pink-500"
        target="_blank"
        rel="noreferrer noopener"
      >
        <img
          src={`${STATIC_ASSETS}/brands/uniswap.png`}
          className="w-5 h-5"
          height={20}
          width={20}
          alt="Uniswap"
        />
        <div>Swap in Uniswap</div>
      </a>
    </div>
  );
};

export default Uniswap;
