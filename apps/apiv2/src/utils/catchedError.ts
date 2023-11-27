import { Errors } from '@hey/data/errors';
import logger from '@hey/lib/logger';
import type { Response } from 'express';

const catchedError = (res: Response, error: any) => {
  logger.error(error);
  return res
    .status(500)
    .json({ success: false, error: Errors.SomethingWentWrong });
};

export default catchedError;
