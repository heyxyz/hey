import { Errors } from '@hey/data/errors';
import logger from '@hey/lib/logger';
import { NodeIrys } from '@irys/sdk';
import catchedError from '@utils/catchedError';
import type { Handler } from 'express';

export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  try {
    const url = 'https://node2.irys.xyz';
    const token = 'matic';
    const client = new NodeIrys({
      url,
      token,
      key: process.env.IRYS_PRIVATE_KEY
    });

    const receipt = await client.upload(JSON.stringify(body), {
      tags: [
        { name: 'content-type', value: 'application/json' },
        { name: 'App-Name', value: 'Hey.xyz' }
      ]
    });
    logger.info(`Uploaded metadata to Irys: ar://${receipt.id}`);

    return res.status(200).json({ success: true, id: receipt.id });
  } catch (error) {
    return catchedError(res, error);
  }
};
