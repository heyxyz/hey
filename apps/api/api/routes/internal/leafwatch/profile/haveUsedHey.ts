import type { Handler } from 'express';

import logger from '@good/helpers/logger';
import catchedError from 'api/helpers/catchedError';
import { SWR_CACHE_AGE_1_SEC_30_DAYS } from 'api/helpers/constants';
import createClickhouseClient from 'api/helpers/createClickhouseClient';
import validateIsStaff from 'api/helpers/middlewares/validateIsStaff';
import { noBody, notAllowed } from 'api/helpers/responses';

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
