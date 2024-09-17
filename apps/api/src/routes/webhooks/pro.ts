import type { Request, Response } from "express";

import catchedError from "src/helpers/catchedError";
import validateSecret from "src/helpers/middlewares/validateSecret";
import { invalidBody, noBody } from "src/helpers/responses";
import updateProStatus from "src/helpers/webhooks/pro/updateProStatus";
import { any, object } from "zod";

type ExtensionRequest = {
  event: { activity: any };
};

const validationSchema = object({
  event: object({ activity: any() })
});

export const post = [
  validateSecret,
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    const validation = validationSchema.safeParse(body);

    if (!validation.success) {
      return invalidBody(res);
    }

    const { event } = body as ExtensionRequest;

    try {
      const data = await updateProStatus(event.activity[0].hash);

      return res.status(200).json({ result: data, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
