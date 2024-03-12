import type { AllowedToken } from '@hey/types/hey';
import type { FC } from 'react';
import type { Address } from 'viem';

import { STATIC_IMAGES_URL } from '@hey/data/constants';
import { TokenContracts } from '@hey/data/contracts';
import getAssetSymbol from '@hey/lib/getAssetSymbol';
import getRedstonePrice from '@hey/lib/getRedstonePrice';
import getTokenImage from '@hey/lib/getTokenImage';
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
  }
];

interface CurrencySelectorProps {
  onSelectCurrency: (currency: AllowedToken) => void;
}

const CurrencySelector: FC<CurrencySelectorProps> = ({ onSelectCurrency }) => {
  const { address } = useAccount();

  const { data: wmaticBalanceData } = useBalance({
    address,
    chainId: 137,
    query: { refetchInterval: 10000 },
    token: TokenContracts['WMATIC'] as Address
  });

  const { data: wethBalanceData } = useBalance({
    address,
    chainId: 137,
    query: { refetchInterval: 10000 },
    token: TokenContracts['WETH'] as Address
  });

  const { data: usdcBalanceData } = useBalance({
    address,
    chainId: 137,
    query: { refetchInterval: 10000 },
    token: TokenContracts['USDC'] as Address
  });

  const { data: wmaticPriceUsd } = useQuery({
    enabled: Boolean(wmaticBalanceData),
    queryFn: async () => await getRedstonePrice(getAssetSymbol('WMATIC')),
    queryKey: ['getRedstonePrice', 'WMATIC']
  });

  const { data: wethPriceUsd } = useQuery({
    enabled: Boolean(wethBalanceData),
    queryFn: async () => await getRedstonePrice(getAssetSymbol('WETH')),
    queryKey: ['getRedstonePrice', 'WETH']
  });

  const { data: usdcPriceUsd } = useQuery({
    enabled: Boolean(usdcBalanceData),
    queryFn: async () => await getRedstonePrice(getAssetSymbol('USDC')),
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

  return (
    <div className="flex h-[80vh] w-full flex-col gap-2 p-5">
      {SUPPORTED_CURRENCIES.map((currency) => {
        return (
          <div
            className="hover:bg-brand-500/10 flex w-full cursor-pointer items-center justify-between rounded-lg p-2"
            key={currency.symbol}
            onClick={() => onSelectCurrency(currency)}
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
                <p className="text-black">{currency.symbol}</p>
                <p className="text-sm text-black/50">Polygon</p>
              </div>
            </div>

            <div className="flex flex-col items-end justify-center leading-none">
              <p className="text-black">
                {balances[currency.symbol as keyof typeof balances].token ??
                  '--'}
              </p>
              <p className="text-sm text-black/50">
                $
                {balances[currency.symbol as keyof typeof balances].usd ?? '--'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CurrencySelector;
