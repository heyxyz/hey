import { MinusIcon, PlusIcon } from '@heroicons/react/outline';
import type { ZoraNft } from '@lenster/types/zora-nft';
import { HelpTooltip } from '@lenster/ui';
import getRedstonePrice from '@lib/getRedstonePrice';
import { useQuery } from '@tanstack/react-query';
import { type FC } from 'react';

import { useZoraMintStore } from '.';

interface PriceProps {
  nft: ZoraNft;
}

const Price: FC<PriceProps> = ({ nft }) => {
  const { quantity, setQuantity, canMintOnLenster } = useZoraMintStore();
  const { data: usdPrice, isLoading } = useQuery(
    ['redstoneData'],
    () => getRedstonePrice('ETH').then((res) => res),
    { enabled: Boolean(nft.price) }
  );

  const price = quantity * parseInt(nft.price);
  const nftPriceInEth = price / 10 ** 18;
  const platformFeesInEth = quantity * 0.000777;

  if (isLoading || !canMintOnLenster) {
    return null;
  }

  const priceInUsd = usdPrice * (nftPriceInEth + platformFeesInEth);

  return (
    <div className="mt-4">
      <div className="divider mb-4" />
      <div className="flex items-center justify-between">
        <div>
          {price > 0 ? (
            <div className="mb-2 flex items-baseline space-x-2 font-mono">
              <div className="text-2xl">{nftPriceInEth}</div>
              <div className="text-sm">ETH</div>
            </div>
          ) : null}
          <div className="mb-1.5 flex items-center space-x-2 font-mono">
            <div className="text-xs">+ ${platformFeesInEth} ETH mint fee</div>
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
          <div className="font-mono text-xs">
            ≈ ${priceInUsd.toFixed(2)} USD
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            disabled={quantity === 1}
            className="rounded-full border p-1.5 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700"
            onClick={() => setQuantity(quantity - 1)}
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <span className="text-xl font-bold">{quantity}</span>
          <button
            disabled={quantity === nft.maxSupply}
            className="rounded-full border p-1.5 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700"
            onClick={() => setQuantity(quantity + 1)}
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Price;
