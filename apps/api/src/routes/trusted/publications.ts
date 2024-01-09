import type { Handler } from 'express';

import catchedError from '@utils/catchedError';
import heyTrustedReports from '@utils/feeds/providers/hey/algorithms/heyTrustedReports';

export const get: Handler = async (req, res) => {
  const limit = (parseInt(req.query?.limit as string) || 50) as number;
  const offset = (parseInt(req.query?.offset as string) || 0) as number;

  try {
    const ids = await heyTrustedReports(limit, offset);

    return res.status(200).json({ ids, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
