import type { Request, Response } from "express";

import prisma from "@hey/db/prisma/db/client";
import logger from "@hey/helpers/logger";
import parseJwt from "@hey/helpers/parseJwt";
import catchedError from "src/helpers/catchedError";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import { invalidBody, noBody } from "src/helpers/responses";
import { array, object, string } from "zod";

type ExtensionRequest = {
  ids: string[];
};

const validationSchema = object({
  ids: array(string()).min(1).max(500)
});

export const post = [
  rateLimiter({ requests: 250, within: 1 }),
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    const validation = validationSchema.safeParse(body);

    if (!validation.success) {
      return invalidBody(res);
    }

    const { ids } = body as ExtensionRequest;

    try {
      const identityToken = req.headers["x-identity-token"] as string;
      const payload = parseJwt(identityToken);
      const profileId = payload.id;

      const [hasTipped, tipCounts] = await prisma.$transaction([
        prisma.tip.findMany({
          select: { publicationId: true },
          where: {
            fromProfileId: profileId,
            publicationId: { in: ids }
          }
        }),
        prisma.tip.groupBy({
          _count: { publicationId: true },
          by: ["publicationId"],
          orderBy: { publicationId: "asc" },
          where: { publicationId: { in: ids } }
        })
      ]);

      const hasTippedMap = new Set(hasTipped.map((tip) => tip.publicationId));

      const result = tipCounts.map(({ _count, publicationId }) => ({
        // @ts-ignore
        count: _count.publicationId,
        id: publicationId,
        tipped: hasTippedMap.has(publicationId)
      }));

      logger.info(`Fetched tips for ${ids.length} publications`);

      return res.status(200).json({ result, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
