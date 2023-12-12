import type { Handler } from 'express';

import { AlgorithmProvider } from '@hey/data/enums';
import catchedError from '@utils/catchedError';
import { SWR_CACHE_AGE_1_MIN_30_DAYS } from '@utils/constants';
import heyFeed from '@utils/feeds/providers/hey/heyFeed';
import k3lFeed from '@utils/feeds/providers/k3l/k3lFeed';
import { noBody } from '@utils/responses';

export const get: Handler = async (req, res) => {
  const provider = req.query.provider as string;
  const strategy = req.query.strategy as string;
  const profile = req.query.profile as string;
  const limit = (parseInt(req.query?.limit as string) || 50) as number;
  const offset = (parseInt(req.query?.offset as string) || 0) as number;

  if (!provider || !strategy) {
    return noBody(res);
  }

  try {
    let ids: string[] = [];
    switch (provider) {
      case AlgorithmProvider.K3L: {
        ids = await k3lFeed(strategy, profile, limit, offset);
        break;
      }
      case AlgorithmProvider.HEY: {
        ids = await heyFeed(strategy, limit, offset);
        break;
      }
      default:
        return res
          .status(200)
          .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
          .json({ message: 'Invalid provider', success: false });
    }

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
      .json({ ids, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
