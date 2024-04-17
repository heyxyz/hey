import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import { SWR_CACHE_AGE_10_MINS_30_DAYS } from 'src/lib/constants';
import { noBody, notAllowed } from 'src/lib/responses';
import createStackClient from 'src/lib/score/createStackClient';

export const get: Handler = async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return noBody(res);
  }

  const network = req.headers['x-lens-network'] as string;

  if (!network) {
    return notAllowed(res);
  }

  try {
    const pointSystemId = network === 'mainnet' ? 1464 : 691;
    const client = createStackClient(pointSystemId);
    const score = await client.getPoints(address as string);

    logger.info(`Fetched score for ${address} - ${score}`);

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_10_MINS_30_DAYS)
      .json({ result: score, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
