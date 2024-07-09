import type { Request, Response } from 'express';

import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import createClickhouseClient from 'src/helpers/createClickhouseClient';
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
      const client = createClickhouseClient();
      const rows = await client.query({
        format: 'JSONEachRow',
        query: `SELECT count(*) as count FROM events WHERE actor = '${id}';`
      });
      const result = await rows.json<{ count: number }>();
      logger.info('Have used hey status fetched');

      return res
        .status(200)
        .json({ haveUsedHey: Number(result[0].count) > 0, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
