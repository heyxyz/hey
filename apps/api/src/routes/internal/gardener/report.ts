import logger from "@hey/helpers/logger";
import { ReportPostDocument } from "@hey/indexer";
import { addTypenameToDocument } from "apollo-utilities";
import axios from "axios";
import type { Request, Response } from "express";
import { print } from "graphql";
import catchedError from "src/helpers/catchedError";
import validateIsGardener from "src/helpers/middlewares/validateIsGardener";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";
import { invalidBody, noBody } from "src/helpers/responses";
import { array, object, string } from "zod";

export const reportPost = async (
  id: string,
  reasons: string[],
  accessToken: string
) => {
  return await Promise.all(
    reasons.map(async (reason: string) => {
      await axios.post(
        "https://api-v2.lens.dev",
        {
          operationName: "ReportPublication",
          query: print(addTypenameToDocument(ReportPostDocument)),
          variables: {
            request: { post: id, reason }
          }
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
    })
  );
};

interface ExtensionRequest {
  id: string;
  reasons: string[];
}

const validationSchema = object({
  id: string(),
  reasons: array(string())
});

// TODO: Add test cases
export const post = [
  validateLensAccount,
  validateIsGardener,
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    const validation = validationSchema.safeParse(body);

    if (!validation.success) {
      return invalidBody(res);
    }

    const { id, reasons } = body as ExtensionRequest;

    try {
      const accessToken = req.headers["x-access-token"] as string;
      await reportPost(id, reasons, accessToken);
      logger.info(`[Lens] Reported post ${id}`);

      return res
        .status(200)
        .json({ result: { reported: reasons }, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
