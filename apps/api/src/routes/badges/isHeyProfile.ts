import type { Handler } from 'express';
import type { Address } from 'viem';

import { HEY_LENS_SIGNUP } from '@hey/data/constants';
import logger from '@hey/lib/logger';
import catchedError from 'src/lib/catchedError';
import { CACHE_AGE_INDEFINITE } from 'src/lib/constants';
import lensPrisma from 'src/lib/lensPrisma';
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
      ? getAddress(address as Address).toLowerCase()
      : undefined;
    const data = await lensPrisma.$queryRaw<{ result: boolean }[]>`
      SELECT EXISTS (
        SELECT 1
        FROM profile.record p
        JOIN app.onboarding_profile o ON p.profile_id = o.profile_id
        WHERE 
          (p.profile_id = ${id} OR p.owned_by = ${address})
          AND o.onboarded_by_address = ${HEY_LENS_SIGNUP}
      ) AS result;  
    `;

    const isHeyProfile = data[0].result;

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
