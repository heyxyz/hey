import lensPg from "@hey/db/lensPg";
import logger from "@hey/helpers/logger";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import validateIsStaff from "src/helpers/middlewares/validateIsStaff";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";
import { invalidBody, noBody } from "src/helpers/responses";
import { array, object, string } from "zod";
import { reportPublication } from "../gardener/report";

interface ExtensionRequest {
  id: string;
  subreasons: string[];
}

const validationSchema = object({
  id: string(),
  subreasons: array(string())
});

// TODO: Add test cases
export const post = [
  validateLensAccount,
  validateIsStaff,
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    const validation = validationSchema.safeParse(body);

    if (!validation.success) {
      return invalidBody(res);
    }

    const { id, subreasons } = body as ExtensionRequest;

    try {
      const accessToken = req.headers["x-access-token"] as string;
      const response = await lensPg.query(
        `
          SELECT publication_id AS id
          FROM publication.record
          WHERE profile_id = $1
          AND publication_type = 'POST'
          LIMIT 1
        `,
        [id]
      );

      const publicationId = response[0]?.id;

      if (!publicationId) {
        return res.status(404).json({
          result: "Nothing to report",
          success: true
        });
      }

      await reportPublication(publicationId, subreasons, accessToken);
      logger.info(`[Lens] Reported profile ${id}`);

      return res.status(200).json({ result: publicationId, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
