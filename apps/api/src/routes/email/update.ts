import type { Handler } from 'express';

import { APP_NAME } from '@good/data/constants';
import logger from '@good/helpers/logger';
import parseJwt from '@good/helpers/parseJwt';
import catchedError from 'src/helpers/catchedError';
import validateLensAccount from 'src/helpers/middlewares/validateLensAccount';
import prisma from 'src/helpers/prisma';
import { invalidBody, noBody, notAllowed } from 'src/helpers/responses';
import sendEmail from 'src/helpers/sendEmail';
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

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  const validateLensAccountStatus = await validateLensAccount(req);
  if (validateLensAccountStatus !== 200) {
    return notAllowed(res, validateLensAccountStatus);
  }

  const { email, resend } = body as ExtensionRequest;

  try {
    const identityToken = req.headers['x-identity-token'] as string;
    const payload = parseJwt(identityToken);

    if (!resend) {
      const data = await prisma.email.findUnique({
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

    const result = await prisma.email.upsert({
      create: { id: payload.id, ...baseData },
      update: { ...baseData },
      where: { id: payload.id }
    });

    sendEmail({
      body: `
        <html>
          <body>
            <p>Welcome to Good!</p> 
            <br>
            <p>Please click the link below to verify your email address: ${result.email}</p>
            <a href="https://api.bcharity.net/email/verify?token=${result.verificationToken}">Verify Email →</a>
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
