import { formatUnits } from "viem";

export interface BalanceData {
  decimals: number;
  fiatRate: number;
  value: bigint;
  visibleDecimals: number;
}

/**
 * Formats the token balances and calculates their USD equivalent.
 *
 * @param balances - The raw balance data for tokens.
 * @returns An object with token symbols as keys and formatted balances and USD equivalents as values.
 */
const formatTokenBalances = (balances: Record<string, BalanceData>) => {
  const formattedBalances: Record<string, { token: string; usd: string }> = {};

  for (const [token, data] of Object.entries(balances)) {
    const tokenAmount = Number.parseFloat(
      formatUnits(data.value, data.decimals)
    ).toFixed(data.visibleDecimals);
    const usdAmount = (Number.parseFloat(tokenAmount) * data.fiatRate).toFixed(
      2
    );
    formattedBalances[token] = { token: tokenAmount, usd: usdAmount };
  }

  return formattedBalances;
};

export default formatTokenBalances;
