import { Errors } from '@hey/data/errors';
import logger from '@hey/lib/logger';
import type { NextApiResponse } from 'next';

const catchedError = (res: NextApiResponse, error: any) => {
  logger.error(error);
  return res
    .status(500)
    .json({ success: false, error: Errors.SomethingWentWrong });
};

export default catchedError;
