import type { Request, Response } from "express";

import prisma from "@hey/db/prisma/db/client";
import { getRedis, setRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";
import parseJwt from "@hey/helpers/parseJwt";
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
      const cacheKey = `poll:${id}`;
      const cachedData = await getRedis(cacheKey);

      if (cachedData) {
        logger.info("(cached) Poll fetched");
        return res
          .status(200)
          .json({ result: JSON.parse(cachedData), success: true });
      }

      const identityToken = req.headers["x-identity-token"] as string;
      const payload = parseJwt(identityToken);

      const data = await prisma.poll.findUnique({
        select: {
          endsAt: true,
          id: true,
          options: {
            orderBy: { index: "asc" },
            select: {
              _count: { select: { responses: true } },
              id: true,
              option: true,
              responses: {
                select: { id: true },
                where: { profileId: payload.id }
              }
            }
          }
        },
        where: { id: id as string }
      });

      if (!data) {
        return res
          .status(400)
          .json({ error: "Poll not found.", success: false });
      }

      const totalResponses = data.options.reduce(
        (acc, option) => acc + option._count.responses,
        0
      );

      const sanitizedData = {
        endsAt: data.endsAt,
        id: data.id,
        options: data.options.map((option) => ({
          id: option.id,
          option: option.option,
          percentage:
            totalResponses > 0
              ? (option._count.responses / totalResponses) * 100
              : 0,
          responses: option._count.responses,
          voted: option.responses.length > 0
        }))
      };

      await setRedis(cacheKey, sanitizedData);
      logger.info("Poll fetched");

      return res.status(200).json({ result: sanitizedData, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
