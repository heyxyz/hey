import type { Handler } from 'express';

import {
  GOOD_LENS_SIGNUP,
  GOOD_MEMBERSHIP_NFT_PUBLICATION_ID
} from '@good/data/constants';
import logger from '@good/helpers/logger';
import lensPg from 'src/db/lensPg';
import catchedError from 'src/helpers/catchedError';
import validateIsStaff from 'src/helpers/middlewares/validateIsStaff';
import { notAllowed } from 'src/helpers/responses';

// TODO: add tests
export const get: Handler = async (req, res) => {
  const validateIsStaffStatus = await validateIsStaff(req);
  if (validateIsStaffStatus !== 200) {
    return notAllowed(res, validateIsStaffStatus);
  }

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
      [GOOD_LENS_SIGNUP, GOOD_MEMBERSHIP_NFT_PUBLICATION_ID]
    );

    const formattedResult = result[0].map((row, index) => ({
      date: new Date(row.date).toISOString(),
      mint_count: Number(result[1][index].mint_count),
      signups_count: Number(row.signups_count)
    }));

    logger.info('Lens: Fetched signup and membership NFT stats');

    return res.status(200).json({ result: formattedResult, success: true });
  } catch (error) {
    catchedError(res, error);
  }
};
