import lensPg from "@hey/db/lensPg";
import logger from "@hey/helpers/logger";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import {
  CACHE_AGE_1_DAY,
  CACHE_AGE_INDEFINITE,
  SITEMAP_BATCH_SIZE
} from "src/helpers/constants";
import { noBody } from "src/helpers/responses";
import { buildUrlsetXml } from "src/helpers/sitemap/buildSitemap";

export const config = {
  api: { responseLimit: "8mb" }
};

// TODO: Add tests
export const get = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return noBody(res);
  }

  const user_agent = req.headers["user-agent"];

  try {
    const offset = (Number(id) - 1) * SITEMAP_BATCH_SIZE || 0;

    const response = await lensPg.query(
      `
        SELECT pr.publication_id, pr.block_timestamp
        FROM publication.record pr
        WHERE pr.publication_type = 'POST' AND pr.is_hidden = false
        ORDER BY pr.block_timestamp
        LIMIT $1
        OFFSET $2;
      `,
      [SITEMAP_BATCH_SIZE, offset]
    );

    const entries = response.map((post) => ({
      lastmod: post.block_timestamp
        .toISOString()
        .replace("T", " ")
        .replace(".000Z", "")
        .split(" ")[0],
      loc: `https://hey.xyz/posts/${post.publication_id}`
    }));

    const xml = buildUrlsetXml(entries);

    logger.info(
      `[Lens] Fetched profiles sitemap for batch ${id} having ${response.length} entries from user-agent: ${user_agent}`
    );
    console.log(response.length === SITEMAP_BATCH_SIZE);
    return res
      .status(200)
      .setHeader("Content-Type", "text/xml")
      .setHeader(
        "Cache-Control",
        response.length === SITEMAP_BATCH_SIZE
          ? CACHE_AGE_INDEFINITE
          : CACHE_AGE_1_DAY
      )
      .send(xml);
  } catch (error) {
    return catchedError(res, error);
  }
};
