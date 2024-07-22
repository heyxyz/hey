import type { Request, Response } from 'express';

import heyPg from '@hey/db/heyPg';
import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import { rateLimiter } from 'src/helpers/middlewares/rateLimiter';
import validateLensAccount from 'src/helpers/middlewares/validateLensAccount';
import { invalidBody, noBody } from 'src/helpers/responses';
import { object, string } from 'zod';

type ExtensionRequest = {
  id: string;
};

const validationSchema = object({
  id: string()
});

// TODO: add tests
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

    const { id } = body as ExtensionRequest;

    try {
      const result = await heyPg.query(
        `
          DELETE FROM "DraftPublication"
          WHERE "id" = $1
          RETURNING *;
        `,
        [id]
      );

      logger.info(`Draft publication deleted for ${id}`);

      return res.status(200).json({ result, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
