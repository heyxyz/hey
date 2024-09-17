import type { BalanceData } from "@hey/helpers/formatTokenBalances";
import type { FC } from "react";
import type { Address } from "viem";

import getBalanceData from "@helpers/getBalanceData";
import {
  STATIC_IMAGES_URL,
  SUPPORTED_DECENT_OA_TOKENS
} from "@hey/data/constants";
import formatTokenBalances from "@hey/helpers/formatTokenBalances";
import getTokenImage from "@hey/helpers/getTokenImage";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import { useAllowedTokensStore } from "src/store/persisted/useAllowedTokensStore";
import { useRatesStore } from "src/store/persisted/useRatesStore";
import { useAccount, useBalance } from "wagmi";

interface CurrencySelectorProps {
  onSelectCurrency: (currency: Address) => void;
}

const CurrencySelector: FC<CurrencySelectorProps> = ({ onSelectCurrency }) => {
  const { fiatRates } = useRatesStore();
  const { allowedTokens } = useAllowedTokensStore();
  const { address } = useAccount();

  const { data: wmaticBalanceData, isLoading: wmaticBalanceLoading } =
    useBalance({
      address,
      chainId: 137,
      query: { refetchInterval: 10000 },
      token: SUPPORTED_DECENT_OA_TOKENS.WMATIC.address
    });

  const { data: wethBalanceData, isLoading: wethBalanceLoading } = useBalance({
    address,
    chainId: 137,
    query: { refetchInterval: 10000 },
    token: SUPPORTED_DECENT_OA_TOKENS.WETH.address
  });

  const { data: usdcBalanceData, isLoading: usdcBalanceLoading } = useBalance({
    address,
    chainId: 137,
    query: { refetchInterval: 10000 },
    token: SUPPORTED_DECENT_OA_TOKENS.USDC.address
  });

  const balanceData: Record<string, BalanceData> = {
    USDC: getBalanceData(
      usdcBalanceData,
      fiatRates,
      SUPPORTED_DECENT_OA_TOKENS.USDC
    ),
    WETH: getBalanceData(
      wethBalanceData,
      fiatRates,
      SUPPORTED_DECENT_OA_TOKENS.WETH
    ),
    WMATIC: getBalanceData(
      wmaticBalanceData,
      fiatRates,
      SUPPORTED_DECENT_OA_TOKENS.WMATIC
    )
  };

  const balances = formatTokenBalances(balanceData);
  const isLoading =
    wmaticBalanceLoading || wethBalanceLoading || usdcBalanceLoading;

  return (
    <div className="h-[80vh] w-full space-y-2 p-5">
      {allowedTokens
        .filter((t) =>
          Object.keys(SUPPORTED_DECENT_OA_TOKENS).includes(t.symbol)
        )
        .map((token) => {
          return (
            <div
              className="flex w-full cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-gray-500/10"
              key={token.symbol}
              onClick={(e) => {
                stopEventPropagation(e);
                onSelectCurrency(token.contractAddress as Address);
              }}
            >
              <div className="flex items-center space-x-2">
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
                    className="absolute right-0 bottom-0"
                    height={16}
                    src={`${STATIC_IMAGES_URL}/chains/polygon.svg`}
                    title="Polygon"
                    width={16}
                  />
                </div>
                <div>
                  <b>{token.symbol}</b>
                  <p className="ld-text-gray-500 text-xs">Polygon</p>
                </div>
              </div>
              <div className="text-right">
                {isLoading ? (
                  <div className="shimmer mb-3 ml-auto h-4 w-16 rounded-lg bg-gray-200" />
                ) : (
                  <p>
                    {balances[token.symbol as keyof typeof balances]?.token ||
                      "--"}
                  </p>
                )}
                {isLoading ? (
                  <div className="shimmer ml-auto h-4 w-12 rounded-lg bg-gray-200" />
                ) : (
                  <p className="text-sm opacity-50">
                    $
                    {balances[token.symbol as keyof typeof balances]?.usd ||
                      "--"}
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
