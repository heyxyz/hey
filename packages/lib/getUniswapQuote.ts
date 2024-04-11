import type { UniswapQuote } from '@hey/types/hey';

import axios from 'axios';
import { parseUnits } from 'viem';

const getUniswapQuote = async (
  tokenIn: string,
  tokenOut: string,
  amount: number,
  chainId: number
): Promise<UniswapQuote> => {
  const payload = {
    amount: parseUnits(amount.toString(), 18).toString(),
    configs: [{ protocols: ['V3'], routingType: 'CLASSIC' }],
    intent: 'quote',
    tokenIn,
    tokenInChainId: chainId,
    tokenOut,
    tokenOutChainId: chainId,
    type: 'EXACT_INPUT'
  };

  const { data } = await axios.post(
    'https://quote.heyxyz.workers.dev',
    payload
  );
  const { quote } = data;

  const lastRoute = quote.route[quote.route.length - 1];
  const lastPool = lastRoute[lastRoute.length - 1];
  const { tokenOut: outToken } = lastPool;

  const output = {
    amountOut: Number(quote.quoteDecimals).toFixed(4),
    maxSlippage: quote.slippage.toString(),
    route: {
      tokenIn: quote.route[0][0]['tokenIn'],
      tokenOut: outToken
    },
    routeString: quote.routeString
  };

  return output;
};

export default getUniswapQuote;
