import type { Request, Response } from 'express';

import logger from '@hey/helpers/logger';
import { NodeIrys } from '@irys/sdk';
import { signMetadata } from '@lens-protocol/metadata';
import catchedError from 'src/helpers/catchedError';
import { rateLimiter } from 'src/helpers/middlewares/rateLimiter';
import { noBody } from 'src/helpers/responses';
import { privateKeyToAccount } from 'viem/accounts';

export const post = [
  rateLimiter({ requests: 30, within: 1 }),
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    try {
      const url = 'https://arweave.mainnet.irys.xyz/tx/matic';
      const token = 'matic';
      const client = new NodeIrys({
        key: process.env.PRIVATE_KEY,
        token,
        url
      });

      const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);
      const signed = await signMetadata(body, (message) =>
        account.signMessage({ message })
      );

      const receipt = await client.upload(JSON.stringify(signed), {
        tags: [
          { name: 'content-type', value: 'application/json' },
          { name: 'App-Name', value: 'Hey.xyz' }
        ]
      });

      logger.info(`Uploaded metadata to Irys: ar://${receipt.id}`);

      return res.status(200).json({ id: receipt.id, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
