import type { Request, Response } from 'express';

import heyPg from '@hey/db/heyPg';
import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import validateIsStaff from 'src/helpers/middlewares/validateIsStaff';
import validateLensAccount from 'src/helpers/middlewares/validateLensAccount';
import { invalidBody, noBody } from 'src/helpers/responses';
import { object, string } from 'zod';

type ExtensionRequest = {
  key: string;
};

const validationSchema = object({
  key: string()
});

export const post = [
  validateLensAccount,
  validateIsStaff,
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    const validation = validationSchema.safeParse(body);

    if (!validation.success) {
      return invalidBody(res);
    }

    const { key } = body as ExtensionRequest;

    try {
      const feature = await heyPg.query(
        `
        INSERT INTO "Feature" ("key", "priority")
        VALUES ($1, 1000)
        RETURNING *;
      `,
        [key]
      );
      logger.info(`Created a feature flag ${feature[0]?.id}`);

      return res.status(200).json({ feature: feature[0], success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
