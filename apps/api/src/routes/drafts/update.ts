import type { Handler } from 'express';

import logger from '@hey/helpers/logger';
import parseJwt from '@hey/helpers/parseJwt';
import heyPg from 'src/db/heyPg';
import catchedError from 'src/helpers/catchedError';
import validateLensAccount from 'src/helpers/middlewares/validateLensAccount';
import { invalidBody, noBody, notAllowed } from 'src/helpers/responses';
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

// TODO: add tests
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

  const { collectModule, content, id } = body as ExtensionRequest;

  try {
    const payload = parseJwt(accessToken);

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
};
