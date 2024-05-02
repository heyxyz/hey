import type { FC } from 'react';
import type { Address } from 'viem';

import { STATIC_IMAGES_URL } from '@hey/data/constants';
import getRedstonePrice from '@hey/helpers/getRedstonePrice';
import getTokenImage from '@hey/helpers/getTokenImage';
import { useQuery } from '@tanstack/react-query';
import { useAllowedTokensStore } from 'src/store/persisted/useAllowedTokensStore';
import { formatUnits } from 'viem';
import { useAccount, useBalance } from 'wagmi';

const OA_SUPPORTED_CURRENCIES = ['USDC', 'WETH', 'WMATIC'];

interface CurrencySelectorProps {
  onSelectCurrency: (currency: Address) => void;
}

const CurrencySelector: FC<CurrencySelectorProps> = ({ onSelectCurrency }) => {
  const { address } = useAccount();

  const { allowedTokens } = useAllowedTokensStore();

  const { data: wmaticBalanceData, isLoading: wmaticBalanceLoading } =
    useBalance({
      address,
      chainId: 137,
      query: { refetchInterval: 10000 },
      token: allowedTokens.find((token) => token.symbol === 'WMATIC')
        ?.contractAddress as Address
    });

  const { data: wethBalanceData, isLoading: wethBalanceLoading } = useBalance({
    address,
    chainId: 137,
    query: { refetchInterval: 10000 },
    token: allowedTokens.find((token) => token.symbol === 'WETH')
      ?.contractAddress as Address
  });

  const { data: usdcBalanceData, isLoading: usdcBalanceLoading } = useBalance({
    address,
    chainId: 137,
    query: { refetchInterval: 10000 },
    token: allowedTokens.find((token) => token.symbol === 'USDC')
      ?.contractAddress as Address
  });

  const { data: wmaticPriceUsd, isLoading: wmaticPriceLoading } = useQuery({
    enabled: Boolean(wmaticBalanceData),
    queryFn: async () => await getRedstonePrice('MATIC'),
    queryKey: ['getRedstonePrice', 'WMATIC']
  });

  const { data: wethPriceUsd, isLoading: wethPriceLoading } = useQuery({
    enabled: Boolean(wethBalanceData),
    queryFn: async () => await getRedstonePrice('ETH'),
    queryKey: ['getRedstonePrice', 'WETH']
  });

  const { data: usdcPriceUsd, isLoading: usdcPriceLoading } = useQuery({
    enabled: Boolean(usdcBalanceData),
    queryFn: async () => await getRedstonePrice('USDC'),
    queryKey: ['getRedstonePrice', 'USDC']
  });

  const balances = {
    USDC:
      usdcBalanceData && usdcPriceUsd
        ? {
            token: parseFloat(
              formatUnits(
                usdcBalanceData?.value as bigint,
                usdcBalanceData?.decimals as number
              )
            ).toFixed(2),
            usd: (
              parseFloat(
                formatUnits(
                  usdcBalanceData?.value as bigint,
                  usdcBalanceData?.decimals as number
                )
              ) * usdcPriceUsd
            ).toFixed(2)
          }
        : { token: 0, usd: 0 },
    WETH:
      wethBalanceData && wethPriceUsd
        ? {
            token: parseFloat(
              formatUnits(
                wethBalanceData?.value as bigint,
                wethBalanceData?.decimals as number
              )
            ).toFixed(2),
            usd: (
              parseFloat(
                formatUnits(
                  wethBalanceData?.value as bigint,
                  wethBalanceData?.decimals as number
                )
              ) * wethPriceUsd
            ).toFixed(2)
          }
        : { token: 0, usd: 0 },
    WMATIC:
      wmaticBalanceData && wmaticPriceUsd
        ? {
            token: parseFloat(
              formatUnits(
                wmaticBalanceData?.value as bigint,
                wmaticBalanceData?.decimals as number
              )
            ).toFixed(2),
            usd: (
              parseFloat(
                formatUnits(
                  wmaticBalanceData?.value as bigint,
                  wmaticBalanceData?.decimals as number
                )
              ) * wmaticPriceUsd
            ).toFixed(2)
          }
        : { token: 0, usd: 0 }
  };

  const isLoading =
    wmaticBalanceLoading ||
    wethBalanceLoading ||
    usdcBalanceLoading ||
    wmaticPriceLoading ||
    wethPriceLoading ||
    usdcPriceLoading;

  return (
    <div className="flex h-[80vh] w-full flex-col gap-2 p-5">
      {allowedTokens
        .filter((t) => OA_SUPPORTED_CURRENCIES.includes(t.symbol))
        .map((token) => {
          return (
            <div
              className="flex w-full cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-gray-500/10"
              key={token.symbol}
              onClick={(e) => {
                e.stopPropagation();
                onSelectCurrency(token.contractAddress as Address);
              }}
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <img
                    alt={token.symbol}
                    className="size-10"
                    height={40}
                    src={getTokenImage(token.symbol)}
                    title={token.name}
                    width={40}
                  />
                  <img
                    alt="Polygon"
                    className="absolute bottom-0 right-0"
                    height={16}
                    src={`${STATIC_IMAGES_URL}/chains/polygon.svg`}
                    title="Polygon"
                    width={16}
                  />
                </div>
                <div className="flex flex-col items-start justify-center leading-none">
                  <p>{token.symbol}</p>
                  <p className="text-sm opacity-50">Polygon</p>
                </div>
              </div>

              <div className="flex flex-col items-end justify-center gap-1 leading-none">
                {isLoading ? (
                  <div className="animate-shimmer h-4 w-16 rounded-lg bg-gray-200" />
                ) : (
                  <p>
                    {balances[token.symbol as keyof typeof balances]?.token ||
                      '--'}
                  </p>
                )}
                {isLoading ? (
                  <div className="animate-shimmer h-4 w-12 rounded-lg bg-gray-200" />
                ) : (
                  <p className="text-sm opacity-50">
                    $
                    {balances[token.symbol as keyof typeof balances]?.usd ||
                      '--'}
                  </p>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default CurrencySelector;
