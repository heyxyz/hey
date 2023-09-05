import type { ZoraNft } from '@lenster/types/zora-nft';
import { HelpTooltip } from '@lenster/ui';
import getRedstonePrice from '@lib/getRedstonePrice';
import { useQuery } from '@tanstack/react-query';
import { type FC } from 'react';

interface PriceProps {
  nft: ZoraNft;
}

const Price: FC<PriceProps> = ({ nft }) => {
  const { data: usdPrice } = useQuery(
    ['redstoneData'],
    () => getRedstonePrice('ETH').then((res) => res),
    { enabled: Boolean(nft.price) }
  );

  const price = parseInt(nft.price);
  const nftPriceInEth = price / 10 ** 18;
  const platformFees = 0.000777;
  const priceInUsd = usdPrice * (nftPriceInEth + platformFees);

  return (
    <div className="mt-4">
      <div className="divider mb-4" />
      {price > 0 ? (
        <div className="mb-2 flex items-baseline space-x-2 font-mono">
          <div className="text-2xl">{nftPriceInEth}</div>
          <div className="text-sm">ETH</div>
        </div>
      ) : null}
      <div className="mb-1.5 flex items-center space-x-2 font-mono">
        <div className="text-xs">+ ${platformFees} ETH mint fee</div>
        <HelpTooltip>
          <div className="space-y-5">
            <div>
              <div>Creator Reward</div>
              <div className="font-bold">0.01 ETH</div>
            </div>
            <div>
              <div>Create Referral Reward</div>
              <div className="font-bold">0.01 ETH</div>
            </div>
            <div>
              <div>Mint Referral Reward</div>
              <div className="font-bold">0.01 ETH</div>
            </div>
            <div>
              <div>Zora Fee</div>
              <div className="font-bold">0.01 ETH</div>
            </div>
          </div>
        </HelpTooltip>
      </div>
      <div className="font-mono text-xs">≈ ${priceInUsd.toFixed(2)} USD</div>
    </div>
  );
};

export default Price;
