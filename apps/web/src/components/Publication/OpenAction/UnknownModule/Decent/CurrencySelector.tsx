import type { FC } from 'react';
import type { Address } from 'viem';

import { STATIC_IMAGES_URL } from '@hey/data/constants';
import formatTokenBalances from '@hey/helpers/formatTokenBalances';
import getTokenImage from '@hey/helpers/getTokenImage';
import { useAllowedTokensStore } from 'src/store/persisted/useAllowedTokensStore';
import { useRatesStore } from 'src/store/persisted/useRatesStore';
import { useAccount, useBalance } from 'wagmi';

const OA_SUPPORTED_CURRENCY_ADDRESSES: Record<string, `0x${string}`> = {
  USDC: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  WETH: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  WMATIC: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'
};

interface CurrencySelectorProps {
  onSelectCurrency: (currency: Address) => void;
}

const CurrencySelector: FC<CurrencySelectorProps> = ({ onSelectCurrency }) => {
  const { allowedTokens } = useAllowedTokensStore();
  const { address } = useAccount();
  const { fiatRates } = useRatesStore();

  const { data: wmaticBalanceData, isLoading: wmaticBalanceLoading } =
    useBalance({
      address,
      chainId: 137,
      query: { refetchInterval: 10000 },
      token: OA_SUPPORTED_CURRENCY_ADDRESSES.WMATIC
    });

  const wmaticPriceUsd =
    fiatRates.find(
      (rate) =>
        rate.address === OA_SUPPORTED_CURRENCY_ADDRESSES.WMATIC.toLowerCase()
    )?.fiat || 0;

  const { data: wethBalanceData, isLoading: wethBalanceLoading } = useBalance({
    address,
    chainId: 137,
    query: { refetchInterval: 10000 },
    token: OA_SUPPORTED_CURRENCY_ADDRESSES.WETH
  });

  const wethPriceUsd =
    fiatRates.find(
      (rate) =>
        rate.address === OA_SUPPORTED_CURRENCY_ADDRESSES.WETH.toLowerCase()
    )?.fiat || 0;

  const { data: usdcBalanceData, isLoading: usdcBalanceLoading } = useBalance({
    address,
    chainId: 137,
    query: { refetchInterval: 10000 },
    token: OA_SUPPORTED_CURRENCY_ADDRESSES.USDC
  });

  const usdcPriceUsd =
    fiatRates.find(
      (rate) =>
        rate.address === OA_SUPPORTED_CURRENCY_ADDRESSES.USDC.toLowerCase()
    )?.fiat || 0;

  const balanceData = {
    USDC: {
      decimals: usdcBalanceData?.decimals || 0,
      fiatRate: usdcPriceUsd,
      value: usdcBalanceData?.value || BigInt(0),
      visibleDecimals: 2
    },
    WETH: {
      decimals: wethBalanceData?.decimals || 0,
      fiatRate: wethPriceUsd,
      value: wethBalanceData?.value || BigInt(0),
      visibleDecimals: 4
    },
    WMATIC: {
      decimals: wmaticBalanceData?.decimals || 0,
      fiatRate: wmaticPriceUsd,
      value: wmaticBalanceData?.value || BigInt(0),
      visibleDecimals: 2
    }
  };

  const balances = formatTokenBalances(balanceData);

  const isLoading =
    wmaticBalanceLoading || wethBalanceLoading || usdcBalanceLoading;

  return (
    <div className="flex h-[80vh] w-full flex-col gap-2 p-5">
      {allowedTokens
        .filter((t) =>
          Object.keys(OA_SUPPORTED_CURRENCY_ADDRESSES).includes(t.symbol)
        )
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
