import type { Handler } from 'express';
import type { Address } from 'viem';

import { HeyLensSignup } from '@hey/abis';
import { HEY_LENS_SIGNUP, ZERO_ADDRESS } from '@hey/data/constants';
import logger from '@hey/lib/logger';
import crypto from 'crypto';
import catchedError from 'src/lib/catchedError';
import createClickhouseClient from 'src/lib/createClickhouseClient';
import getRpc from 'src/lib/getRpc';
import { invalidBody, noBody, notAllowed } from 'src/lib/responses';
import { createWalletClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { polygon, polygonAmoy } from 'viem/chains';
import { boolean, number, object, string } from 'zod';

type ExtensionRequest = {
  data: {
    attributes: {
      order_number: number;
      user_email: string;
    };
  };
  meta: {
    custom_data: {
      address: string;
      delegatedExecutor: string;
      handle: string;
    };
    test_mode: boolean;
  };
};

const validationSchema = object({
  data: object({
    attributes: object({
      order_number: number(),
      user_email: string()
    })
  }),
  meta: object({
    custom_data: object({
      address: string(),
      delegatedExecutor: string(),
      handle: string()
    }),
    test_mode: boolean()
  })
});

export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  try {
    const secret = process.env.SECRET!;
    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(req.body).digest('hex'), 'utf8');
    const signature = Buffer.from(req.get('X-Signature') || '', 'utf8');

    if (!crypto.timingSafeEqual(digest, signature)) {
      throw new Error('Invalid signature.');
    }
  } catch (error) {
    return catchedError(res, error);
  }

  // env is delimited by commas with no spaces
  const privateKeys = process.env.RELAYER_PRIVATE_KEYS;

  if (!privateKeys) {
    return notAllowed(res);
  }

  const parsedBody = JSON.parse(body);
  const validation = validationSchema.safeParse(parsedBody);

  if (!validation.success) {
    return invalidBody(res);
  }

  const { data, meta } = parsedBody as ExtensionRequest;
  const { custom_data, test_mode } = meta;
  const { address, delegatedExecutor, handle } = custom_data;
  const { order_number, user_email: email } = data.attributes;

  const allPrivateKeys = privateKeys.split(',');
  const randomPrivateKey =
    allPrivateKeys[Math.floor(Math.random() * allPrivateKeys.length)];

  try {
    const account = privateKeyToAccount(randomPrivateKey as Address);

    const client = createWalletClient({
      account,
      chain: test_mode ? polygonAmoy : polygon,
      transport: getRpc({ mainnet: !test_mode })
    });

    const hash = await client.writeContract({
      abi: HeyLensSignup,
      address: HEY_LENS_SIGNUP,
      args: [[address, ZERO_ADDRESS, '0x'], handle, [delegatedExecutor]],
      functionName: 'createProfileWithHandle'
    });

    // Begin: Log to Clickhouse
    if (!test_mode) {
      const clickhouseClient = createClickhouseClient();
      clickhouseClient.insert({
        format: 'JSONEachRow',
        table: 'signups',
        values: { address, email, handle, hash, order_number }
      });
    }
    // End: Log to Clickhouse

    logger.info(
      `Minted Lens Profile for ${address} with handle ${handle} on ${hash}`
    );

    return res.status(200).json({ hash, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
