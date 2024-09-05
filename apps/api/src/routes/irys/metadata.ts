import type { Request, Response } from 'express';

import logger from '@hey/helpers/logger';
import { Uploader } from '@irys/upload';
import { Matic } from '@irys/upload-ethereum';
import { signMetadata } from '@lens-protocol/metadata';
import catchedError from 'src/helpers/catchedError';
import { rateLimiter } from 'src/helpers/middlewares/rateLimiter';
import { noBody } from 'src/helpers/responses';
import { privateKeyToAccount } from 'viem/accounts';

const getIrysUploader = async () => {
  return await Uploader(Matic).withWallet(process.env.PRIVATE_KEY).build();
};

export const post = [
  rateLimiter({ requests: 30, within: 1 }),
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    try {
      const irys = await getIrysUploader();
      const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);
      const signed = await signMetadata(body, (message) =>
        account.signMessage({ message })
      );

      const receipt = await irys.upload(JSON.stringify(signed), {
        tags: [
          { name: 'content-type', value: 'application/json' },
          { name: 'App-Name', value: 'Hey.xyz' }
        ]
      });

      logger.info(
        `Uploaded metadata to Irys: https://gateway.irys.xyz/${receipt.id}`
      );

      return res.status(200).json({ id: receipt.id, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
