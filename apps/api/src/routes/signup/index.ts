import type { Handler } from 'express';

import { HeyLensSignup } from '@hey/abis';
import { HEY_LENS_SIGNUP, ZERO_ADDRESS } from '@hey/data/constants';
import logger from '@hey/lib/logger';
import axios from 'axios';
import catchedError from 'src/lib/catchedError';
import { PADDLE_API_ENDPOINT } from 'src/lib/constants';
import { invalidBody, noBody, notAllowed } from 'src/lib/responses';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { polygonMumbai } from 'viem/chains';
import { object, string } from 'zod';

type ExtensionRequest = {
  data: {
    custom_data: {
      address: string;
      delegatedExecutor: string;
      handle: string;
    };
    id: string;
  };
};

const validationSchema = object({
  data: object({
    custom_data: object({
      address: string(),
      delegatedExecutor: string(),
      handle: string()
    }),
    id: string()
  })
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
    console.error(validation.error);
    return invalidBody(res);
  }

  const { data } = body as ExtensionRequest;
  const { custom_data, id } = data;
  const { address, delegatedExecutor, handle } = custom_data;

  try {
    // Check Paddle is the Transaction is valid
    const response = await axios.get(
      `${PADDLE_API_ENDPOINT}/transactions/${id}`,
      { headers: { Authorization: `Bearer ${process.env.PADDLE_API_KEY}` } }
    );

    if (response.data.data.status !== 'completed') {
      return res.status(400).json({
        message: 'Transaction not completed',
        success: false
      });
    }

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
