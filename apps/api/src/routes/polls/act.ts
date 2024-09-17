import type { Request, Response } from "express";

import prisma from "@hey/db/prisma/db/client";
import { delRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";
import parseJwt from "@hey/helpers/parseJwt";
import catchedError from "src/helpers/catchedError";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";
import { invalidBody, noBody } from "src/helpers/responses";
import { object, string } from "zod";

type ExtensionRequest = {
  option: string;
  poll: string;
};

const validationSchema = object({
  option: string().uuid(),
  poll: string().uuid()
});

export const post = [
  rateLimiter({ requests: 30, within: 1 }),
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

    const { option, poll } = body as ExtensionRequest;

    try {
      const identityToken = req.headers["x-identity-token"] as string;
      const payload = parseJwt(identityToken);

      const expired = await prisma.poll.findUnique({
        select: { endsAt: true },
        where: { endsAt: { lt: new Date() }, id: poll as string }
      });

      if (expired) {
        return res.status(400).json({ error: "Poll expired.", success: false });
      }
      // End: Check if the poll expired

      // Begin: Check if the poll exists and delete the existing response
      const existingResponse = await prisma.pollResponse.findFirst({
        where: { option: { pollId: poll as string }, profileId: payload.id }
      });

      if (existingResponse?.id) {
        await prisma.pollResponse.delete({
          where: { id: existingResponse.id }
        });
      }
      // End: Check if the poll exists and delete the existing response

      const data = await prisma.pollResponse.create({
        data: { optionId: option, profileId: payload.id }
      });

      await delRedis(`poll:${poll}`);
      logger.info(`Responded to a poll ${option}:${data.id}`);

      return res.status(200).json({ id: data.id, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
