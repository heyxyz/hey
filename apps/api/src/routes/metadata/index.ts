import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import { NodeIrys } from '@irys/sdk';
import catchedError from 'src/helpers/catchedError';
import { noBody } from 'src/helpers/responses';
import { privateKeyToAccount } from 'viem/accounts';

const sortObject = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sortObject);
  }

  return Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      result[key] = sortObject(obj[key]);
      return result;
    }, {} as any);
};

export const post: Handler = async (req, res) => {
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
    const stringified = JSON.stringify(sortObject(body.lens));
    const signature = await account.signMessage({ message: stringified });
    body.signature = signature;

    const receipt = await client.upload(JSON.stringify(body), {
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
};
