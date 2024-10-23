import { Errors } from "@hey/data/errors";
import type { Response } from "express";

export const invalidBody = (response: Response) => {
  return response
    .status(400)
    .json({ error: Errors.InvalidBody, success: false });
};

export const noBody = (response: Response) => {
  return response.status(400).json({ error: Errors.NoBody, success: false });
};

export const notFound = (response: Response) => {
  return response.status(404).json({ error: Errors.NotFound, success: false });
};
