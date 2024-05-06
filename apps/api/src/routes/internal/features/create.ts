import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import heyPg from 'src/db/heyPg';
import catchedError from 'src/helpers/catchedError';
import validateIsStaff from 'src/helpers/middlewares/validateIsStaff';
import { invalidBody, noBody, notAllowed } from 'src/helpers/responses';
import { object, string } from 'zod';

type ExtensionRequest = {
  key: string;
};

const validationSchema = object({
  key: string()
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

  if (!(await validateIsStaff(req))) {
    return notAllowed(res);
  }

  const { key } = body as ExtensionRequest;

  try {
    const feature = await heyPg.query(
      `
        INSERT INTO "Feature" ("key")
        VALUES ($1)
        RETURNING *;
      `,
      [key]
    );
    logger.info(`Created a feature flag ${feature[0]?.id}`);

    return res.status(200).json({ feature: feature[0], success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
