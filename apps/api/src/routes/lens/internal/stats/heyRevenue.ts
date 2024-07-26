import type { Request, Response } from 'express';

import {
  HEY_LENS_SIGNUP,
  HEY_MEMBERSHIP_NFT_PUBLICATION_ID
} from '@hey/data/constants';
import lensPg from '@hey/db/lensPg';
import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import validateIsStaff from 'src/helpers/middlewares/validateIsStaff';
import validateLensAccount from 'src/helpers/middlewares/validateLensAccount';

// TODO: add tests
export const get = [
  validateLensAccount,
  validateIsStaff,
  async (_: Request, res: Response) => {
    try {
      const result = await lensPg.multi(
        `
        SELECT
          block_timestamp::date AS date,
          COUNT(*) AS signups_count
        FROM app.onboarding_profile
        WHERE
          onboarded_by_address = $1
          AND block_timestamp >= NOW() - INTERVAL '30 days'
        GROUP BY date
        ORDER BY date;
        SELECT
          block_timestamp::date AS date,
          COUNT(*) AS mint_count
        FROM publication.open_action_module_acted_record
        WHERE
          publication_id = $2
          AND block_timestamp >= NOW() - INTERVAL '30 days'
        GROUP BY date
        ORDER BY date;
      `,
        [HEY_LENS_SIGNUP, HEY_MEMBERSHIP_NFT_PUBLICATION_ID]
      );

      const formattedResult = result[0].map((row, index) => ({
        date: new Date(row.date).toISOString(),
        mint_count: Number(result[1][index].mint_count),
        signups_count: Number(row.signups_count)
      }));

      logger.info('[Lens] Fetched signup and membership NFT stats');

      return res.status(200).json({ result: formattedResult, success: true });
    } catch (error) {
      catchedError(res, error);
    }
  }
];
