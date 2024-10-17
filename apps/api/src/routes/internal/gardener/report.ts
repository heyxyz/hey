import { ReportPublicationDocument } from "@hey/lens";
import { addTypenameToDocument } from "apollo-utilities";
import axios from "axios";
import type { Request, Response } from "express";
import { print } from "graphql";
import catchedError from "src/helpers/catchedError";
import validateIsGardener from "src/helpers/middlewares/validateIsGardener";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";
import { invalidBody, noBody } from "src/helpers/responses";
import { array, object, string } from "zod";

type ExtensionRequest = {
  id: string;
  subreasons: string[];
};

const validationSchema = object({
  id: string(),
  subreasons: array(string())
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

    const { id, subreasons } = body as ExtensionRequest;

    try {
      const accessToken = req.headers["x-access-token"] as string;
      await Promise.all(
        subreasons.map(async (subreason: string) => {
          await axios.post(
            "https://api-v2.lens.dev",
            {
              operationName: "ReportPublication",
              query: print(addTypenameToDocument(ReportPublicationDocument)),
              variables: {
                request: {
                  for: id,
                  reason: { spamReason: { reason: "SPAM", subreason } }
                }
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

      return res
        .status(200)
        .json({ result: { reported: subreasons }, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
