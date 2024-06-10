import type { Handler } from 'express';

import logger from '@good/helpers/logger';
import goodPg from 'api/db/goodPg';
import catchedError from 'api/helpers/catchedError';
import validateIsStaff from 'api/helpers/middlewares/validateIsStaff';
import { invalidBody, noBody, notAllowed } from 'api/helpers/responses';
import { boolean, object, string } from 'zod';

type ExtensionRequest = {
  enabled: boolean;
  id: string;
};

const validationSchema = object({
  enabled: boolean(),
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

  const validateIsStaffStatus = await validateIsStaff(req);
  if (validateIsStaffStatus !== 200) {
    return notAllowed(res, validateIsStaffStatus);
  }

  const { enabled, id } = body as ExtensionRequest;

  try {
    await goodPg.query(`UPDATE "Feature" SET enabled = $1 WHERE id = $2`, [
      enabled,
      id
    ]);
    logger.info(`Killed feature ${id}`);

    return res.status(200).json({ enabled, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
