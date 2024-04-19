import type { Handler } from 'express';

import { APP_NAME } from '@hey/data/constants';
import logger from '@hey/lib/logger';
import parseJwt from '@hey/lib/parseJwt';
import catchedError from 'src/lib/catchedError';
import heyPrisma from 'src/lib/heyPrisma';
import validateLensAccount from 'src/lib/middlewares/validateLensAccount';
import { invalidBody, noBody, notAllowed } from 'src/lib/responses';
import sendEmail from 'src/lib/sendEmail';
import { v4 as uuid } from 'uuid';
import { boolean, object, string } from 'zod';

type ExtensionRequest = {
  email: string;
  resend?: boolean;
};

const validationSchema = object({
  email: string().email(),
  resend: boolean().optional()
});

export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  const accessToken = req.headers['x-access-token'] as string;
  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  if (!(await validateLensAccount(req))) {
    return notAllowed(res);
  }

  const { email, resend } = body as ExtensionRequest;

  try {
    const payload = parseJwt(accessToken);

    if (!resend) {
      const data = await heyPrisma.email.findUnique({
        where: { id: payload.id }
      });

      if (data?.email === email) {
        return res.status(200).json({ success: false });
      }
    }

    const baseData = {
      email: email.toLowerCase(),
      tokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      verificationToken: uuid(),
      verified: false
    };

    const result = await heyPrisma.email.upsert({
      create: { id: payload.id, ...baseData },
      update: { ...baseData },
      where: { id: payload.id }
    });

    sendEmail({
      body: `
        <html>
          <body>
            <p>Welcome to Hey!</p> 
            <br>
            <p>Please click the link below to verify your email address: ${result.email}</p>
            <a href="https://api.hey.xyz/email/verify?token=${result.verificationToken}">Verify Email →</a>
            <br>
            <p>If you didn't request this email, please ignore this email.</p>
            <br>
            <p>Thanks,</p>
            <p>${APP_NAME} team</p>
          </body>
        </html>
      `,
      recipient: result.email,
      subject: `Verify your ${APP_NAME} email address`
    });

    logger.info(`Email updated to ${email} for ${payload.id}`);

    return res.status(200).json({ success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
