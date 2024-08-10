import type { Request, Response } from 'express';

import leafwatch from '@hey/db/prisma/leafwatch/client';
import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import validateIsStaff from 'src/helpers/middlewares/validateIsStaff';
import validateLensAccount from 'src/helpers/middlewares/validateLensAccount';
import { noBody } from 'src/helpers/responses';

export const get = [
  validateLensAccount,
  validateIsStaff,
  async (req: Request, res: Response) => {
    const { id } = req.query;

    if (!id) {
      return noBody(res);
    }

    try {
      const count = await leafwatch.event.count({
        where: { actor: id as string }
      });

      logger.info('Have used hey status fetched');

      return res.status(200).json({ haveUsedHey: count > 0, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
