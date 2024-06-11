import type { Handler } from 'express';

import logger from '@good/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import { SWR_CACHE_AGE_1_SEC_30_DAYS } from 'src/helpers/constants';
import createClickhouseClient from 'src/helpers/createClickhouseClient';
import validateIsStaff from 'src/helpers/middlewares/validateIsStaff';
import { noBody, notAllowed } from 'src/helpers/responses';

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  const validateIsStaffStatus = await validateIsStaff(req);
  if (validateIsStaffStatus !== 200) {
    return notAllowed(res, validateIsStaffStatus);
  }

  try {
    const client = createClickhouseClient();
    const rows = await client.query({
      format: 'JSONEachRow',
      query: `SELECT count(*) as count FROM events WHERE actor = '${id}';`
    });
    const result = await rows.json<{ count: number }>();
    logger.info('Have used good status fetched');

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_1_SEC_30_DAYS)
      .json({ haveUsedGood: Number(result[0].count) > 0, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
