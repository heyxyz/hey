import lensPg from "@hey/db/lensPg";
import { getRedis, setRedis } from "@hey/db/redisClient";
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

  const userAgent = req.headers["user-agent"];
  const redisKey = `sitemap:posts:batch:${id}`;

  try {
    const cachedData = await getRedis(redisKey);
    let entries: { lastmod: string; loc: string }[] = [];

    if (cachedData) {
      entries = JSON.parse(cachedData);
      logger.info(
        `(cached) [Lens] Fetched posts sitemap for batch ${id} having ${entries.length} entries from user-agent: ${userAgent}`
      );
    } else {
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

      entries = response.map((post) => ({
        lastmod: post.block_timestamp
          .toISOString()
          .replace("T", " ")
          .replace(".000Z", "")
          .split(" ")[0],
        loc: `https://hey.xyz/posts/${post.publication_id}`
      }));

      await setRedis(redisKey, JSON.stringify(entries));
      logger.info(
        `[Lens] Fetched posts sitemap for batch ${id} having ${response.length} entries from user-agent: ${userAgent}`
      );
    }

    const xml = buildUrlsetXml(entries);

    return res
      .status(200)
      .setHeader("Content-Type", "text/xml")
      .setHeader(
        "Cache-Control",
        entries.length === SITEMAP_BATCH_SIZE
          ? CACHE_AGE_INDEFINITE
          : CACHE_AGE_1_DAY
      )
      .send(xml);
  } catch (error) {
    return catchedError(res, error);
  }
};
