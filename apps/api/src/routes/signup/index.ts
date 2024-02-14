import type { Handler } from 'express';

import { HeyLensSignup } from '@hey/abis';
import { HEY_LENS_SIGNUP, ZERO_ADDRESS } from '@hey/data/constants';
import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import { invalidBody, noBody, notAllowed } from 'src/lib/responses';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { polygonMumbai } from 'viem/chains';
import { object, string } from 'zod';

type ExtensionRequest = {
  address: string;
  delegatedExecutor: string;
  handle: string;
};

const validationSchema = object({
  address: string(),
  delegatedExecutor: string(),
  handle: string()
});

export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  const privateKey = process.env.RELAYER_PRIVATE_KEY;

  if (!privateKey) {
    return notAllowed(res);
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  const { address, delegatedExecutor, handle } = body as ExtensionRequest;

  try {
    const account = privateKeyToAccount(
      process.env.RELAYER_PRIVATE_KEY as `0x${string}`
    );

    const client = createWalletClient({
      account,
      chain: polygonMumbai,
      transport: http()
    });

    const hash = await client.writeContract({
      abi: HeyLensSignup,
      address: HEY_LENS_SIGNUP,
      args: [[address, ZERO_ADDRESS, '0x'], handle, [delegatedExecutor]],
      functionName: 'createProfileWithHandle'
    });

    logger.info(
      `Minted Lens Profile for ${address} with handle ${handle} on ${hash}`
    );

    return res.status(200).json({ hash, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
