import type { Request, Response } from 'express';

import heyPg from '@hey/db/heyPg';
import logger from '@hey/helpers/logger';
import catchedError from 'src/helpers/catchedError';
import validateIsStaff from 'src/helpers/middlewares/validateIsStaff';
import validateLensAccount from 'src/helpers/middlewares/validateLensAccount';
import { invalidBody, noBody } from 'src/helpers/responses';
import { boolean, object, string } from 'zod';

type ExtensionRequest = {
  enabled: boolean;
  id: string;
};

const validationSchema = object({
  enabled: boolean(),
  id: string()
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

    const { enabled, id } = body as ExtensionRequest;

    try {
      await heyPg.query(`UPDATE "Feature" SET enabled = $1 WHERE id = $2`, [
        enabled,
        id
      ]);
      logger.info(`Killed feature ${id}`);

      return res.status(200).json({ enabled, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
