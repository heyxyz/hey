import type { BalanceData } from "@hey/helpers/formatTokenBalances";
import type { FiatRate } from "@hey/types/lens";

interface BalanceInfo {
  decimals?: number;
  value?: bigint | string | number;
}

interface CurrencyInfo {
  address: `0x${string}`;
  visibleDecimals: number;
}

const getBalanceData = (
  balanceData: BalanceInfo | undefined,
  fiatRates: FiatRate[],
  currency: CurrencyInfo
): BalanceData => {
  const fiatRate =
    fiatRates.find((rate) => rate.address === currency.address.toLowerCase())
      ?.fiat || 0;

  const value: bigint =
    typeof balanceData?.value === "bigint"
      ? balanceData.value
      : BigInt(balanceData?.value ? balanceData.value.toString() : "0");

  return {
    decimals: balanceData?.decimals || 0,
    fiatRate,
    value,
    visibleDecimals: currency.visibleDecimals
  };
};

export default getBalanceData;
