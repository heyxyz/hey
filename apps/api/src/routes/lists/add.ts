import { Errors } from "@hey/data/errors";
import lensPg from "@hey/db/lensPg";
import prisma from "@hey/db/prisma/db/client";
import { delRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";
import parseJwt from "@hey/helpers/parseJwt";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";
import { invalidBody, noBody, notFound } from "src/helpers/responses";
import { boolean, object, string } from "zod";

interface ExtensionRequest {
  listId: string;
  profileId: string;
  add: boolean;
}

const validationSchema = object({
  listId: string().min(1),
  profileId: string().min(1),
  add: boolean()
});

export const post = [
  validateLensAccount,
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    const validation = validationSchema.safeParse(body);

    if (!validation.success) {
      return invalidBody(res);
    }

    const { listId, profileId, add } = body as ExtensionRequest;

    try {
      const identityToken = req.headers["x-identity-token"] as string;
      const payload = parseJwt(identityToken);
      const listProfilesCacheKey = `list:profiles:${listId}`;
      const listCacheKey = `list:${listId}`;

      const clearCache = async () => {
        await Promise.all([
          delRedis(listProfilesCacheKey),
          delRedis(listCacheKey)
        ]);
      };

      const result = await lensPg.query(
        `
          SELECT EXISTS (
            SELECT 1 FROM profile.record
            WHERE profile_id = $1
            AND is_burnt = false
            LIMIT 1
          ) AS result;
        `,
        [profileId]
      );

      const hasProfile = result[0]?.result;

      if (!hasProfile) {
        return notFound(res);
      }

      // Check if the list exists and belongs to the authenticated user and the number of profiles in the list
      const [list, count] = await prisma.$transaction([
        prisma.list.findUnique({
          where: { id: listId, createdBy: payload.id }
        }),
        prisma.listProfile.count({ where: { listId } })
      ]);

      if (!list) {
        return catchedError(res, new Error(Errors.Unauthorized), 401);
      }

      if (count >= 500) {
        return catchedError(
          res,
          new Error(
            "You have reached the maximum number of profiles in a list!"
          ),
          400
        );
      }

      if (add) {
        const listProfile = await prisma.listProfile.create({
          data: { listId, profileId }
        });
        await clearCache();
        logger.info(`Added profile ${profileId} to list ${listId}`);

        return res.status(200).json({ result: listProfile, success: true });
      }

      await prisma.listProfile.delete({
        where: { profileId_listId: { profileId, listId } }
      });
      await clearCache();
      logger.info(`Removed profile ${profileId} from list ${listId}`);

      return res.status(200).json({ success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
