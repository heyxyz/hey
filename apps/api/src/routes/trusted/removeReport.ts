import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import createClickhouseClient from '@utils/createClickhouseClient';
import validateIsGardener from '@utils/middlewares/validateIsGardener';
import { invalidBody, noBody, notAllowed } from '@utils/responses';
import { object, string } from 'zod';

type ExtensionRequest = {
  id: string;
};

const validationSchema = object({
  id: string()
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

  if (!(await validateIsGardener(req))) {
    return notAllowed(res);
  }

  const { id } = body as ExtensionRequest;

  try {
    const client = createClickhouseClient();
    await client.command({
      query: `DELETE FROM trusted_reports WHERE publication_id = '${id}';`
    });
    logger.info('Deleted report from trusted reports');

    return res.status(200).json({ success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
