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

  const user_agent = req.headers["user-agent"];
  const redisKey = `sitemap:profiles:batch:${id}`;

  try {
    const cachedData = await getRedis(redisKey);
    let entries: { lastmod: string; loc: string }[] = [];

    if (cachedData) {
      entries = JSON.parse(cachedData);
      logger.info(
        `(cached) [Lens] Fetched profiles sitemap for batch ${id} having ${entries.length} entries from user-agent: ${user_agent}`
      );
    } else {
      const offset = (Number(id) - 1) * SITEMAP_BATCH_SIZE || 0;

      const response = await lensPg.query(
        `
          SELECT h.local_name, hl.block_timestamp
          FROM namespace.handle h
          JOIN namespace.handle_link hl ON h.handle_id = hl.handle_id
          JOIN profile.record p ON hl.token_id = p.profile_id
          WHERE p.is_burnt = false
          ORDER BY p.block_timestamp
          LIMIT $1
          OFFSET $2;
        `,
        [SITEMAP_BATCH_SIZE, offset]
      );

      entries = response.map((handle) => ({
        lastmod: handle.block_timestamp
          .toISOString()
          .replace("T", " ")
          .replace(".000Z", "")
          .split(" ")[0],
        loc: `https://hey.xyz/u/${handle.local_name}`
      }));

      await setRedis(redisKey, JSON.stringify(entries));
      logger.info(
        `[Lens] Fetched profiles sitemap for batch ${id} having ${response.length} entries from user-agent: ${user_agent}`
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
