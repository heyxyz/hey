import { Errors } from '@hey/data/errors';
import logger from '@hey/lib/logger';
import allowCors from '@utils/allowCors';
import catchedError from '@utils/catchedError';
import { SWR_CACHE_AGE_1_MIN_30_DAYS } from '@utils/constants';
import prisma from '@utils/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  try {
    const data = await prisma.poll.findUnique({
      where: { id: id as string },
      select: {
        id: true,
        endedAt: true,
        options: {
          select: {
            option: true,
            _count: { select: { responses: true } }
          }
        }
      }
    });
    logger.info('Poll fetched from DB');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_MIN_30_DAYS)
      .json({
        success: true,
        result: data
      });
  } catch (error) {
    return catchedError(res, error);
  }
};

export default allowCors(handler);
