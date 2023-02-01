import { Analytics } from '@lib/analytics';
import getUniswapURL from '@lib/getUniswapURL';
import { Trans } from '@lingui/macro';
import { STATIC_IMAGES_URL } from 'data/constants';
import type { FC } from 'react';
import { PUBLICATION } from 'src/tracking';

interface Props {
  module: any;
}

const Uniswap: FC<Props> = ({ module }) => {
  return (
    <div className="space-y-1">
      <div className="text-sm">
        <Trans>
          You don't have enough <b>{module?.amount?.asset?.symbol}</b>
        </Trans>
      </div>
      <a
        href={getUniswapURL(parseFloat(module?.amount?.value), module?.amount?.asset?.address)}
        onClick={() => {
          Analytics.track(PUBLICATION.COLLECT_MODULE.OPEN_UNISWAP);
        }}
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
