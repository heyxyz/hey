import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import allocations from 'src/data/score-allocations';
import catchedError from 'src/helpers/catchedError';
import prisma from 'src/helpers/prisma';
import { noBody } from 'src/helpers/responses';

// TODO: add tests
export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const adjustedProfileScore = await prisma.adjustedProfileScore.findMany({
      where: {
        profileId: id as string,
        reason: { in: allocations.map((allocation) => allocation.id) }
      }
    });

    const result = adjustedProfileScore.map(({ reason, score }) => ({
      ...allocations.find((allocation) => allocation.id === reason),
      score
    }));

    logger.info(
      `Lens: Fetched ${adjustedProfileScore.length} allocations for ${id}`
    );

    return res.status(200).json({ result, success: true });
  } catch (error) {
    catchedError(res, error);
  }
};
