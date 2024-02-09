import type { Handler } from 'express';

import catchedError from 'src/lib/catchedError';

export const get: Handler = async (req, res) => {
  try {
    return res.status(200).json({
      result: ['4everland', 'invites'],
      success: true
    });
  } catch (error) {
    return catchedError(res, error);
  }
};
