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

  const output = {
    amountOut: Number(quote.quoteDecimals).toFixed(4),
    maxSlippage: quote.slippage.toString(),
    route: {
      tokenIn: quote.route[0][0]['tokenIn'],
      tokenOut: quote.route[0][0]['tokenOut']
    },
    routeString: quote.routeString
  };

  return output;
};

export default getUniswapQuote;
