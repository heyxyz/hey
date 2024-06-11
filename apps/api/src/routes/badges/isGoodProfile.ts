import type { Handler } from 'express';
import type { Address } from 'viem';

import { GOOD_LENS_SIGNUP } from '@good/data/constants';
import logger from '@good/helpers/logger';
import lensPg from 'src/db/lensPg';
import catchedError from 'src/helpers/catchedError';
import { CACHE_AGE_INDEFINITE } from 'src/helpers/constants';
import { noBody } from 'src/helpers/responses';
import { getAddress } from 'viem';

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
      [id, formattedAddress, GOOD_LENS_SIGNUP]
    );

    const isGoodProfile = data[0]?.result;

    logger.info(`Good profile badge fetched for ${id || formattedAddress}`);

    return res
      .status(200)
      .setHeader(
        'Cache-Control',
        isGoodProfile ? CACHE_AGE_INDEFINITE : 'no-cache'
      )
      .json({ isGoodProfile, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
