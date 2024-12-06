import { Errors } from "@hey/data/errors";
import lensPg from "@hey/db/lensPg";
import logger from "@hey/helpers/logger";
import parseJwt from "@hey/helpers/parseJwt";
import { Parser } from "@json2csv/plainjs";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { CACHE_AGE_30_MINS } from "src/helpers/constants";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";
import { noBody } from "src/helpers/responses";

export const get = [
  rateLimiter({ requests: 10, within: 1 }),
  validateLensAccount,
  async (req: Request, res: Response) => {
    const { address } = req.query;

    if (!address) {
      return noBody(res);
    }

    try {
      const idToken = req.headers["x-id-token"] as string;
      const payload = parseJwt(idToken);
      const targetAccountAddress = (address as string).split("-")[0];

      if (payload.act.sub !== targetAccountAddress) {
        return catchedError(res, new Error(Errors.Unauthorized), 401);
      }

      const openActionModuleCollectNftOwnership = await lensPg.query(
        `
          SELECT po.owner_address as address
          FROM publication.open_action_module_collect_nft_ownership AS po
          WHERE po.publication_id = $1;
        `,
        [address]
      );

      const fields = ["address"];
      const parser = new Parser({ fields });
      const csv = parser.parse(openActionModuleCollectNftOwnership);

      logger.info(`[Lens] Exported collect addresses list for ${address}`);

      return res
        .status(200)
        .setHeader("Content-Type", "text/csv")
        .setHeader(
          "Content-Disposition",
          `attachment; filename="collect_addresses_${address}.csv"`
        )
        .setHeader("Cache-Control", CACHE_AGE_30_MINS)
        .send(csv);
    } catch (error) {
      catchedError(res, error);
    }
  }
];
