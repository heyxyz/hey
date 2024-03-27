import type { UniswapQuote } from '@hey/types/hey';

import axios from 'axios';
import { parseUnits } from 'viem';

const getUniswapQuote = async (
  tokenIn: string,
  tokenOut: string,
  amount: number,
  chainId: number
): Promise<UniswapQuote> => {
  const uniswapData = {
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
    'https://interface.gateway.uniswap.org/v2/quote',
    uniswapData,
    {
      headers: {
        Origin: 'https://app.uniswap.org',
        'X-Request-Source': 'uniswap-web'
      }
    }
  );
  const { quote } = data;

  const output = {
    amountOut: Number(quote.quoteDecimals).toFixed(4),
    maxSlippage: quote.slippage.toString(),
    routeString: quote.routeString
  };

  return output;
};

export default getUniswapQuote;
