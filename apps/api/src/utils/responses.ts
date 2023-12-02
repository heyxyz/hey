import { Errors } from '@hey/data';
import type { Response } from 'express';

export const notAllowed = (response: Response) => {
  return response
    .status(400)
    .json({ success: false, error: Errors.NotAllowed });
};

export const invalidBody = (response: Response) => {
  return response
    .status(400)
    .json({ success: false, error: Errors.InvalidBody });
};

export const noBody = (response: Response) => {
  return response.status(400).json({ success: false, error: Errors.NoBody });
};
