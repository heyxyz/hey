import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { noBody } from "src/helpers/responses";

export const post = [
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    try {
      return res.status(200).json({
        allowed: true,
        sponsored: true,
        appVerificationEndpoint: "https://bigint.ngrok.app/lens/verification"
      });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
