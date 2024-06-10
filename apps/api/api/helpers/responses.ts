import type { Response } from 'express';

import { Errors } from '@good/data';

const getMessageByStatus = (status: number) => {
  switch (status) {
    case 400:
      return Errors.InvalidBody;
    case 401:
      return Errors.Unauthorized;
    case 500:
      return Errors.SomethingWentWrong;
    default:
      return Errors.NotAllowed;
  }
};

export const notAllowed = (response: Response, status?: number) => {
  return response
    .status(status || 401)
    .json({ error: getMessageByStatus(status || 401), success: false });
};

export const invalidBody = (response: Response) => {
  return response
    .status(400)
    .json({ error: Errors.InvalidBody, success: false });
};

export const noBody = (response: Response) => {
  return response.status(400).json({ error: Errors.NoBody, success: false });
};
