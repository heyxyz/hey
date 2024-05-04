import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import parseJwt from '@hey/helpers/parseJwt';
import heyPg from 'src/db/heyPg';
import catchedError from 'src/helpers/catchedError';
import validateLensAccount from 'src/helpers/middlewares/validateLensAccount';
import { notAllowed } from 'src/helpers/responses';

// TODO: add tests
export const get: Handler = async (req, res) => {
  const accessToken = req.headers['x-access-token'] as string;

  if (!(await validateLensAccount(req))) {
    return notAllowed(res);
  }

  try {
    const payload = parseJwt(accessToken);

    const result = await heyPg.query(
      `
        SELECT *
        FROM "DraftPublication"
        WHERE "profileId" = $1
        ORDER BY "updatedAt" DESC;
      `,
      [payload.id]
    );

    logger.info(`Drafts fetched for ${payload.id}`);

    return res.status(200).json({ result, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
