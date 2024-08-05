import type { Request, Response } from 'express';
import type { Address } from 'viem';

import { Errors } from '@hey/data';
import { POLYGON_RPCS } from '@hey/data/rpcs';
import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import validateSecret from 'src/helpers/middlewares/validateSecret';
import { invalidBody, noBody } from 'src/helpers/responses';
import { createWalletClient, http } from 'viem';
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
};

const validationSchema = object({
  amount: string()
});

export const post = [
  validateSecret,
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    const validation = validationSchema.safeParse(body);

    if (!validation.success) {
      return invalidBody(res);
    }

    const { amount } = body as ExtensionRequest;

    if (!process.env.ADMIN_PRIVATE_KEY) {
      return res
        .status(400)
        .json({ error: Errors.InvalidEnvironmentVariable, success: false });
    }

    try {
      const account = privateKeyToAccount(
        process.env.ADMIN_PRIVATE_KEY as Address
      );
      const client = createWalletClient({
        account,
        chain: polygon,
        transport: http(POLYGON_RPCS[0])
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
  }
];
