import type { Handler } from 'express';

import catchedError from 'src/lib/catchedError';
import heyReports from 'src/lib/feeds/providers/hey/algorithms/heyReports';

export const get: Handler = async (req, res) => {
  const limit = (parseInt(req.query?.limit as string) || 50) as number;
  const offset = (parseInt(req.query?.offset as string) || 0) as number;

  try {
    return res
      .status(200)
      .json({ ids: await heyReports(limit, offset), success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
