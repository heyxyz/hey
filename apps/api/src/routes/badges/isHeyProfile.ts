import type { Handler } from 'express';
import type { Address } from 'viem';

import { HEY_LENS_SIGNUP } from '@hey/data/constants';
import logger from '@hey/lib/logger';
import lensPg from 'src/db/lensPg';
import catchedError from 'src/lib/catchedError';
import { CACHE_AGE_INDEFINITE } from 'src/lib/constants';
import { noBody } from 'src/lib/responses';
import { getAddress } from 'viem';

// TODO: add tests
export const get: Handler = async (req, res) => {
  const { address, id } = req.query;

  if (!id && !address) {
    return noBody(res);
  }

  try {
    const formattedAddress = address
      ? getAddress(address as Address)
      : undefined;
    const data = await lensPg.query(
      `
        SELECT EXISTS (
          SELECT 1
          FROM profile.record p
          JOIN app.onboarding_profile o ON p.profile_id = o.profile_id
          WHERE
            (p.profile_id = $1 OR p.owned_by = $2)
            AND o.onboarded_by_address = $3
        ) AS result;
      `,
      [id, formattedAddress, HEY_LENS_SIGNUP]
    );

    const isHeyProfile = data[0]?.result;

    logger.info(`Hey profile badge fetched for ${id || formattedAddress}`);

    return res
      .status(200)
      .setHeader(
        'Cache-Control',
        isHeyProfile ? CACHE_AGE_INDEFINITE : 'no-cache'
      )
      .json({ isHeyProfile, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
