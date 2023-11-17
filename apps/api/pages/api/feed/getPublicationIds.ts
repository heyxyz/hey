import { AlgorithmProvider } from '@hey/data/enums';
import { Errors } from '@hey/data/errors';
import type { NextApiRequest, NextApiResponse } from 'next';
import allowCors from 'utils/allowCors';
import { CACHE_AGE } from 'utils/constants';
import heyFeed from 'utils/feeds/providers/hey/heyFeed';
import k3lFeed from 'utils/feeds/providers/k3l/k3lFeed';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const provider = req.query.provider as string;
  const strategy = req.query.strategy as string;
  const profile = req.query.profile as string;
  const limit = (parseInt(req.query?.limit as string) || 50) as number;
  const offset = (parseInt(req.query?.offset as string) || 0) as number;

  if (!provider || !strategy) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  try {
    let ids: string[] = [];
    switch (provider) {
      case AlgorithmProvider.K3L:
        ids = await k3lFeed(strategy, profile, limit, offset);
        break;
      case AlgorithmProvider.HEY:
        ids = await heyFeed(strategy, limit, offset);
        break;
      default:
        return res
          .status(200)
          .setHeader('Cache-Control', CACHE_AGE)
          .json({ success: false, message: 'Invalid provider' });
    }

    return res
      .status(200)
      .setHeader('Cache-Control', CACHE_AGE)
      .json({ success: true, ids });
  } catch (error) {
    throw error;
  }
};

export default allowCors(handler);
