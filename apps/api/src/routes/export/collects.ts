import type { Request, Response } from "express";

import { Errors } from "@hey/data/errors";
import lensPg from "@hey/db/lensPg";
import logger from "@hey/helpers/logger";
import parseJwt from "@hey/helpers/parseJwt";
import { Parser } from "@json2csv/plainjs";
import catchedError from "src/helpers/catchedError";
import { CACHE_AGE_30_MINS } from "src/helpers/constants";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import { noBody } from "src/helpers/responses";

export const get = [
  rateLimiter({ requests: 10, within: 1 }),
  // validateLensAccount,
  async (req: Request, res: Response) => {
    const { id } = req.query;

    if (!id) {
      return noBody(res);
    }

    try {
      const identityToken = req.headers["x-identity-token"] as string;
      const payload = parseJwt(identityToken);
      const targetProfileId = (id as string).split("-")[0];

      if (payload.id !== targetProfileId) {
        return catchedError(res, new Error(Errors.Unauthorized), 401);
      }

      const response = await lensPg.query(
        `
          SELECT po.owner_address as address
          FROM publication.open_action_module_collect_nft_ownership AS po
          WHERE po.publication_id = $1;
        `,
        [id]
      );

      const fields = ["address"];
      const parser = new Parser({ fields });
      const csv = parser.parse(response);

      logger.info(`[Lens] Exported collect addresses list for ${id}`);

      return res
        .status(200)
        .setHeader("Content-Type", "text/csv")
        .setHeader(
          "Content-Disposition",
          `attachment; filename="collect_addresses_${id}.csv"`
        )
        .setHeader("Cache-Control", CACHE_AGE_30_MINS)
        .send(csv);
    } catch (error) {
      catchedError(res, error);
    }
  }
];
