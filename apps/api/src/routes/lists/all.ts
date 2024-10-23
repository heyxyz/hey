import prisma from "@hey/db/prisma/db/client";
import logger from "@hey/helpers/logger";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import { noBody } from "src/helpers/responses";

export const get = [
  rateLimiter({ requests: 500, within: 1 }),
  async (req: Request, res: Response) => {
    const { id } = req.query;

    if (!id) {
      return noBody(res);
    }

    try {
      const data = await prisma.list.findMany({
        include: { _count: { select: { profiles: true } } },
        where: { profiles: { some: { profileId: id as string } } }
      });

      const result = data.map((list) => {
        const { _count, ...rest } = list;

        return {
          ...rest,
          count: _count.profiles
        };
      });

      logger.info(`Lists fetched for ${id}`);

      return res.status(200).json({ result, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
