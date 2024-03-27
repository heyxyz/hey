import type { Handler } from 'express';

import { Regex } from '@hey/data/regex';
import logger from '@hey/lib/logger';
import axios from 'axios';
import catchedError from 'src/lib/catchedError';
import { invalidBody, noBody } from 'src/lib/responses';
import { polygon, polygonMumbai } from 'viem/chains';
import { object, string } from 'zod';

type ExtensionRequest = {
  amount: string;
  tokenIn: string;
  tokenOut: string;
};

const validationSchema = object({
  amount: string(),
  tokenIn: string().regex(Regex.ethereumAddress),
  tokenOut: string().regex(Regex.ethereumAddress)
});

export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  const network = req.headers['x-lens-network'] as string;
  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  const { amount, tokenIn, tokenOut } = body as ExtensionRequest;

  try {
    const chainId = network === 'mainnet' ? polygon.id : polygonMumbai.id;

    const uniswapData = {
      amount,
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
      { headers: { Origin: 'https://app.uniswap.org' } }
    );
    const { quote } = data;

    const output = {
      amount: Number(quote.quoteDecimals).toFixed(4),
      maxSlippage: quote.slippage.toString()
    };

    logger.info(`Fetched the quote from Uniswap for ${tokenOut}`);

    return res.status(200).json({ quote: output, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
