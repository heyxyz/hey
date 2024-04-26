import type { Handler } from 'express';

import catchedError from 'src/lib/catchedError';
import prisma from 'src/lib/prisma';

// TODO: add tests
export const get: Handler = async (req, res) => {
  try {
    const score = await prisma.cachedProfileScore.aggregate({
      _count: { score: true },
      _sum: { score: true }
    });

    return res.status(200).json({
      cached: score._count.score,
      success: true,
      volume: score._sum.score || 0
    });
  } catch (error) {
    catchedError(res, error);
  }
};
