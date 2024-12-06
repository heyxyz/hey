import { APP_NAME } from "@hey/data/constants";
import prisma from "@hey/db/prisma/db/client";
import { delRedis } from "@hey/db/redisClient";
import isEmailAllowed from "@hey/helpers/isEmailAllowed";
import logger from "@hey/helpers/logger";
import parseJwt from "@hey/helpers/parseJwt";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import sendEmail from "src/helpers/email/sendEmail";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";
import { invalidBody, noBody } from "src/helpers/responses";
import { v4 as uuid } from "uuid";
import { boolean, object, string } from "zod";

interface ExtensionRequest {
  email: string;
  resend?: boolean;
}

const validationSchema = object({
  email: string().email(),
  resend: boolean().optional()
});

// TODO: Throw if emails is already in use
export const post = [
  rateLimiter({ requests: 50, within: 60 }),
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

    const { email, resend } = body as ExtensionRequest;

    try {
      if (!isEmailAllowed(email)) {
        return res
          .status(400)
          .json({ error: "Email not allowed", success: false });
      }

      const idToken = req.headers["x-id-token"] as string;
      const payload = parseJwt(idToken);

      if (!resend) {
        const foundEmail = await prisma.email.findUnique({
          where: { id: payload.act.sub }
        });

        if (foundEmail?.email === email) {
          return res.status(200).json({ success: false });
        }
      }

      const baseData = {
        email: email.toLowerCase(),
        tokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        verificationToken: uuid(),
        verified: false
      };

      const upsertedEmail = await prisma.email.upsert({
        create: { id: payload.act.sub, ...baseData },
        update: baseData,
        where: { id: payload.act.sub }
      });

      sendEmail({
        body: `
          <html>
            <body>
              <p>Welcome to Hey!</p> 
              <br />
              <p>Please click the link below to verify your email address: ${upsertedEmail.email}</p>
              <a href="https://api.hey.xyz/email/verify?token=${upsertedEmail.verificationToken}">Verify Email →</a>
              <br />
              <p>If you didn't request this email, please ignore this email.</p>
              <br />
              <p>Thanks,</p>
              <p>${APP_NAME} team</p>
            </body>
          </html>
        `,
        recipient: upsertedEmail.email,
        subject: `Verify your ${APP_NAME} email address`
      });

      await delRedis(`preference:${payload.act.sub}`);
      logger.info(`Email updated to ${email} for ${payload.act.sub}`);

      return res.status(200).json({ success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
