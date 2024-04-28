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
    configs: [
      {
        enableFeeOnTransferFeeFetching: true,
        enableUniversalRouter: true,
        protocols: ['V2', 'V3', 'MIXED'],
        routingType: 'CLASSIC'
      }
    ],
    intent: 'quote',
    sendPortionEnabled: true,
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
    amountOut: (
      Number(quote.quoteGasAndPortionAdjustedDecimals) +
      Number(quote.gasUseEstimateQuoteDecimals)
    ).toFixed(4),
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
