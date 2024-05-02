import type { AllowedToken } from '@hey/types/hey';
import type { FC } from 'react';
import type { Address } from 'viem';

import { STATIC_IMAGES_URL } from '@hey/data/constants';
import { TokenContracts } from '@hey/data/contracts';
import getRedstonePrice from '@hey/helpers/getRedstonePrice';
import getTokenImage from '@hey/helpers/getTokenImage';
import { useQuery } from '@tanstack/react-query';
import { formatUnits } from 'viem';
import { useAccount, useBalance } from 'wagmi';

const SUPPORTED_CURRENCIES = [
  {
    contractAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    decimals: 18,
    id: 'WMATIC',
    name: 'Wrapped MATIC',
    symbol: 'WMATIC'
  },
  {
    contractAddress: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    decimals: 18,
    id: 'WETH',
    name: 'Wrapped ETH',
    symbol: 'WETH'
  },
  {
    contractAddress: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    decimals: 6,
    id: 'USDC',
    name: 'USD Coin',
    symbol: 'USDC'
  },
  {
    contractAddress: '0x3d2bD0e15829AA5C362a4144FdF4A1112fa29B5c',
    decimals: 18,
    id: 'BONSAI',
    name: 'Bonsai Token',
    symbol: 'BONSAI'
  }
];

interface CurrencySelectorProps {
  onSelectCurrency: (currency: AllowedToken) => void;
}

const CurrencySelector: FC<CurrencySelectorProps> = ({ onSelectCurrency }) => {
  const { address } = useAccount();

  const { data: wmaticBalanceData, isLoading: wmaticBalanceLoading } =
    useBalance({
      address,
      chainId: 137,
      query: { refetchInterval: 10000 },
      token: TokenContracts['WMATIC'] as Address
    });

  const { data: wethBalanceData, isLoading: wethBalanceLoading } = useBalance({
    address,
    chainId: 137,
    query: { refetchInterval: 10000 },
    token: TokenContracts['WETH'] as Address
  });

  const { data: usdcBalanceData, isLoading: usdcBalanceLoading } = useBalance({
    address,
    chainId: 137,
    query: { refetchInterval: 10000 },
    token: TokenContracts['USDC'] as Address
  });

  const { data: bonsaiBalanceData, isLoading: bonsaiBalanceLoading } =
    useBalance({
      address,
      chainId: 137,
      query: { refetchInterval: 10000 },
      token: TokenContracts['BONSAI'] as Address
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

  const { data: bonsaiPriceUsd, isLoading: bonsaiPriceLoading } = useQuery({
    enabled: Boolean(bonsaiBalanceData),
    queryFn: async () => await getRedstonePrice('BONSAI'),
    queryKey: ['getRedstonePrice', 'BONSAI']
  });

  const balances = {
    BONSAI:
      bonsaiBalanceData && bonsaiPriceUsd
        ? {
            token: parseFloat(
              formatUnits(
                bonsaiBalanceData?.value as bigint,
                bonsaiBalanceData?.decimals as number
              )
            ).toFixed(2),
            usd: (
              parseFloat(
                formatUnits(
                  bonsaiBalanceData?.value as bigint,
                  bonsaiBalanceData?.decimals as number
                )
              ) * wmaticPriceUsd
            ).toFixed(2)
          }
        : { token: 0, usd: 0 },
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
    bonsaiBalanceLoading ||
    wmaticPriceLoading ||
    wethPriceLoading ||
    usdcPriceLoading ||
    bonsaiPriceLoading;

  return (
    <div className="flex h-[80vh] w-full flex-col gap-2 p-5">
      {SUPPORTED_CURRENCIES.map((currency) => {
        return (
          <div
            className="hover:bg-brand-500/10 flex w-full cursor-pointer items-center justify-between rounded-lg p-2"
            key={currency.symbol}
            onClick={(e) => {
              e.stopPropagation();
              onSelectCurrency(currency);
            }}
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <img
                  alt={currency.symbol}
                  className="size-10"
                  height={40}
                  src={getTokenImage(currency.symbol)}
                  title={currency.name}
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
                <p>{currency.symbol}</p>
                <p className="text-sm opacity-50">Polygon</p>
              </div>
            </div>

            <div className="flex flex-col items-end justify-center gap-1 leading-none">
              {isLoading ? (
                <div className="animate-shimmer h-4 w-16 rounded-lg bg-gray-200" />
              ) : (
                <p>
                  {balances[currency.symbol as keyof typeof balances].token ??
                    '--'}
                </p>
              )}
              {isLoading ? (
                <div className="animate-shimmer h-4 w-12 rounded-lg bg-gray-200" />
              ) : (
                <p className="text-sm opacity-50">
                  $
                  {balances[currency.symbol as keyof typeof balances].usd ??
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
