import type { Request, Response } from 'express';

import heyPg from '@hey/db/heyPg';
import logger from '@hey/helpers/logger';
import parseJwt from '@hey/helpers/parseJwt';
import catchedError from 'src/helpers/catchedError';
import { rateLimiter } from 'src/helpers/middlewares/rateLimiter';
import validateLensAccount from 'src/helpers/middlewares/validateLensAccount';
import { invalidBody, noBody } from 'src/helpers/responses';
import { object, string } from 'zod';

type ExtensionRequest = {
  collectModule: null | string;
  content: string;
  id: null | string;
};

const validationSchema = object({
  collectModule: string().nullable(),
  content: string().min(1).max(100000),
  id: string().nullable()
});

export const post = [
  rateLimiter({ requests: 50, within: 1 }),
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

    const { collectModule, content, id } = body as ExtensionRequest;

    try {
      const identityToken = req.headers['x-identity-token'] as string;
      const payload = parseJwt(identityToken);

      if (id) {
        const result = await heyPg.query(
          `
          UPDATE "DraftPublication"
          SET "content" = $1, "collectModule" = $2
          WHERE "id" = $3
          RETURNING *;
        `,
          [content, collectModule, id as string]
        );

        logger.info(`Draft updated for ${payload.id} - ${result[0]?.id}`);

        return res.status(200).json({ result: result[0], success: true });
      } else {
        const result = await heyPg.query(
          `
          INSERT INTO "DraftPublication" ("profileId", "content", "collectModule", "updatedAt")
          VALUES ($1, $2, $3, now())
          RETURNING *;
        `,
          [payload.id, content, collectModule]
        );

        logger.info(`Draft created for ${payload.id} - ${result[0]?.id}`);

        return res.status(200).json({ result: result[0], success: true });
      }
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
