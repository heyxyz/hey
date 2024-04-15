import type { Response } from 'express';

import { Errors } from '@hey/data';

export const notAllowed = (response: Response) => {
  return response
    .status(401)
    .json({ error: Errors.NotAllowed, success: false });
};

export const invalidBody = (response: Response) => {
  return response
    .status(400)
    .json({ error: Errors.InvalidBody, success: false });
};

export const noBody = (response: Response) => {
  return response.status(400).json({ error: Errors.NoBody, success: false });
};
