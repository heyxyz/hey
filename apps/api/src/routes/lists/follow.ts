import lensPg from "@hey/db/lensPg";
import prisma from "@hey/db/prisma/db/client";
import logger from "@hey/helpers/logger";
import parseJwt from "@hey/helpers/parseJwt";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";
import { noBody } from "src/helpers/responses";

export const get = [
  rateLimiter({ requests: 500, within: 1 }),
  validateLensAccount,
  async (req: Request, res: Response) => {
    const { id } = req.query;

    if (!id) {
      return noBody(res);
    }

    try {
      const identityToken = req.headers["x-identity-token"] as string;
      const payload = parseJwt(identityToken);

      const data = await prisma.listProfile.findMany({
        where: { listId: id as string }
      });

      const profiles = data.map((item) => item.profileId);

      // Ensure there are profiles to check
      if (profiles.length === 0) {
        return res.status(200).json({ result: [], success: true });
      }

      const result = await lensPg.query(
        `
          WITH target_profiles AS (
            SELECT unnest($1::varchar[]) AS profile_id
          )
          SELECT tp.profile_id
          FROM target_profiles tp
          LEFT JOIN profile.follower pf ON pf.profile_follower_id = $2
            AND pf.profile_id = tp.profile_id
          WHERE pf.profile_id IS NULL;
        `,
        [profiles, payload.id]
      );

      const filteredProfiles = result.map((item) => item.profile_id);
      logger.info(`Non-followed profiles fetched for list ID ${id}`);

      return res.status(200).json({ result: filteredProfiles, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
