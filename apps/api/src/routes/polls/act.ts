import prisma from "@hey/db/prisma/db/client";
import { delRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";
import parseJwt from "@hey/helpers/parseJwt";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";
import { invalidBody, noBody } from "src/helpers/responses";
import { object, string } from "zod";

interface ExtensionRequest {
  option: string;
  poll: string;
}

const validationSchema = object({
  option: string().uuid(),
  poll: string().uuid()
});

export const post = [
  rateLimiter({ requests: 100, within: 1 }),
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
      const idToken = req.headers["x-id-token"] as string;
      const payload = parseJwt(idToken);

      // Begin: Check if the poll expired
      const expired = await prisma.poll.findUnique({
        select: { endsAt: true },
        where: { endsAt: { lt: new Date() }, id: poll as string }
      });

      if (expired) {
        return res.status(400).json({ error: "Poll expired.", success: false });
      }
      // End: Check if the poll expired

      // Begin: Check if the poll exists and delete the existing response
      const existingPollResponse = await prisma.pollResponse.findFirst({
        where: {
          option: { pollId: poll as string },
          accountAddress: payload.act.sub
        }
      });

      if (existingPollResponse?.id) {
        await prisma.pollResponse.delete({
          where: { id: existingPollResponse.id }
        });
      }
      // End: Check if the poll exists and delete the existing response

      const pollResponse = await prisma.pollResponse.create({
        data: { optionId: option, accountAddress: payload.act.sub }
      });

      await delRedis(`poll:${poll}`);
      logger.info(`Responded to a poll ${option}:${pollResponse.id}`);

      return res.status(200).json({ id: pollResponse.id, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
