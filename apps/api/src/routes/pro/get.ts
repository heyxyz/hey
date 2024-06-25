import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import prisma from 'src/helpers/prisma';
import { noBody } from 'src/helpers/responses';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const pro = await prisma.pro.findUnique({
      where: { id: id as string }
    });

    if (!pro) {
      return res
        .status(404)
        .json({ result: { expiresAt: null, isPro: false } });
    }

    const result = { expiresAt: pro.expiresAt, isPro: true };

    logger.info(`Fetched pro status for ${id}`);

    return res.status(200).json({ result, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
