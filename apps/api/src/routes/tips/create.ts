import type { Handler } from 'express';
import type { Address } from 'viem';

import { HEY_TIPPING, IS_MAINNET } from '@hey/data/constants';
import { Regex } from '@hey/data/regex';
import logger from '@hey/lib/logger';
import parseJwt from '@hey/lib/parseJwt';
import catchedError from 'src/lib/catchedError';
import getRpc from 'src/lib/getRpc';
import heyPrisma from 'src/lib/heyPrisma';
import validateLensAccount from 'src/lib/middlewares/validateLensAccount';
import { invalidBody, noBody, notAllowed } from 'src/lib/responses';
import { createPublicClient, getAddress } from 'viem';
import { polygon, polygonAmoy } from 'viem/chains';
import { number, object, string } from 'zod';

type ExtensionRequest = {
  amount: number;
  fromAddress: string;
  id: string;
  toAddress: string;
  tokenAddress: string;
  txHash: string;
};

const validationSchema = object({
  amount: number(),
  fromAddress: string().regex(Regex.ethereumAddress),
  id: string(),
  toAddress: string().regex(Regex.ethereumAddress),
  tokenAddress: string().regex(Regex.ethereumAddress),
  txHash: string().regex(Regex.txHash)
});

export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  const accessToken = req.headers['x-access-token'] as string;
  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  if (!(await validateLensAccount(req))) {
    return notAllowed(res);
  }

  const { amount, fromAddress, id, toAddress, tokenAddress, txHash } =
    body as ExtensionRequest;

  try {
    const payload = parseJwt(accessToken);

    const client = createPublicClient({
      chain: IS_MAINNET ? polygon : polygonAmoy,
      transport: getRpc({ mainnet: IS_MAINNET })
    });

    const transaction = await client.getTransactionReceipt({
      hash: txHash as `0x${string}`
    });

    if (
      getAddress(transaction.from as Address) !== fromAddress ||
      getAddress(transaction.to as Address) !== HEY_TIPPING
    ) {
      return res.status(400).json({ error: 'Invalid transaction' });
    }

    console.log(transaction);

    const data = await heyPrisma.tip.create({
      data: {
        amount,
        fromAddress,
        fromProfileId: payload.id,
        publicationId: id,
        toAddress,
        tokenAddress,
        toProfileId: id.split('-')[0],
        txHash
      }
    });

    logger.info(`Created a tip ${data.id}`);

    return res.status(200).json({ result: data, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
