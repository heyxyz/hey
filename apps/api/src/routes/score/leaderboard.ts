import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import { notAllowed } from 'src/lib/responses';
import createStackClient from 'src/lib/score/createStackClient';

// TODO: add tests
export const get: Handler = async (req, res) => {
  const network = req.headers['x-lens-network'] as string;

  if (!network) {
    return notAllowed(res);
  }

  try {
    const pointSystemId = network === 'mainnet' ? 1464 : 691;
    const client = createStackClient(pointSystemId);
    const leaderboard = await client.getLeaderboard({ limit: 5 });

    logger.info('Fetched score leaderboard');
    return res.status(200).json({ result: leaderboard, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
