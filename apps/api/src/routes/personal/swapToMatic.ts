import type { Handler } from 'express';

import { Errors } from '@hey/data';
import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import getRpc from 'src/helpers/getRpc';
import { invalidBody, noBody } from 'src/helpers/responses';
import { createWalletClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { polygon } from 'viem/chains';
import { object, string } from 'zod';

const ABI = [
  {
    constant: false,
    inputs: [{ name: 'wad', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  }
];

type ExtensionRequest = {
  amount: string;
  secret: string;
};

const validationSchema = object({
  amount: string(),
  secret: string()
});

export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  const { amount, secret } = body as ExtensionRequest;

  if (secret !== process.env.SECRET) {
    return res
      .status(400)
      .json({ error: Errors.InvalidSecret, success: false });
  }

  try {
    const account = privateKeyToAccount(`0x${process.env.ADMIN_PRIVATE_KEY}`);
    const client = createWalletClient({
      account,
      chain: polygon,
      transport: getRpc({ mainnet: true })
    });

    const bigintAmount = BigInt(amount);
    const hash = await client.writeContract({
      abi: ABI,
      address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
      args: [bigintAmount],
      functionName: 'withdraw'
    });

    logger.info(`Swapped ${amount} to MATIC by ${account.address}`);

    return res.status(200).json({ hash, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
