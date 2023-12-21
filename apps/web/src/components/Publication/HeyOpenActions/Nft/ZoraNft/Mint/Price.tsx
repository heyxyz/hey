import type { ZoraNft } from '@hey/types/nft';
import type { FC } from 'react';

import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import getRedstonePrice from '@hey/lib/getRedstonePrice';
import { HelpTooltip } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';

import { useZoraMintStore } from '.';

interface PriceProps {
  nft: ZoraNft;
}

const Price: FC<PriceProps> = ({ nft }) => {
  const quantity = useZoraMintStore((state) => state.quantity);
  const setQuantity = useZoraMintStore((state) => state.setQuantity);
  const canMintOnHey = useZoraMintStore((state) => state.canMintOnHey);

  const { data: usdPrice, isLoading } = useQuery({
    enabled: Boolean(nft.price),
    queryFn: async () => await getRedstonePrice('ETH'),
    queryKey: ['getRedstonePrice']
  });

  const price = quantity * parseInt(nft.price);
  const nftPriceInEth = price / 10 ** 18;
  const platformFeesInEth = quantity * 0.000777;

  const creatorReward = 0.000111 * quantity;
  const createReferralReward = 0.000222 * quantity;
  const mintReferralReward = 0.000222 * quantity;
  const zoraFee = 0.000222 * quantity;

  if (isLoading || !canMintOnHey) {
    return null;
  }

  const priceInUsd = usdPrice * (nftPriceInEth + platformFeesInEth);

  interface FeesProps {
    eth: number;
    title: string;
  }

  const Fees: FC<FeesProps> = ({ eth, title }) => (
    <div>
      <div>{title}</div>
      <div className="font-bold">
        {eth.toFixed(6)} ETH
        <span className="ml-1 text-[10px]">
          (${(eth * usdPrice).toFixed(2)} USD)
        </span>
      </div>
    </div>
  );

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
            <div className="text-xs">+ {platformFeesInEth} ETH mint fee</div>
            <HelpTooltip>
              <div className="space-y-5">
                <Fees eth={creatorReward} title="Creator Reward" />
                <Fees
                  eth={createReferralReward}
                  title="Create Referral Reward"
                />
                <Fees eth={mintReferralReward} title="Mint Referral Reward" />
                <Fees eth={zoraFee} title="Zora Fee" />
              </div>
            </HelpTooltip>
          </div>
          <div className="font-mono text-xs">
            ≈ ${priceInUsd.toFixed(2)} USD
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            className="rounded-full border p-1.5 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700"
            disabled={quantity === 1}
            onClick={() => setQuantity(quantity - 1)}
            type="button"
          >
            <MinusIcon className="size-4" />
          </button>
          <span className="text-xl font-bold">{quantity}</span>
          <button
            className="rounded-full border p-1.5 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700"
            disabled={quantity === nft.maxSupply}
            onClick={() => setQuantity(quantity + 1)}
            type="button"
          >
            <PlusIcon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Price;
