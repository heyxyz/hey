import lensPg from "@hey/db/lensPg";
import { getRedis, setRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { CACHE_AGE_1_DAY, SITEMAP_BATCH_SIZE } from "src/helpers/constants";
import { buildSitemapXml } from "src/helpers/sitemap/buildSitemap";

export const get = async (req: Request, res: Response) => {
  const userAgent = req.headers["user-agent"];
  const redisKey = "sitemap:posts:total";

  try {
    const cachedData = await getRedis(redisKey);
    let totalPosts: number;

    if (cachedData) {
      totalPosts = Number(cachedData);
      logger.info(`[Lens] Fetched totalPosts from Redis: ${totalPosts}`);
    } else {
      const response = await lensPg.query(`
        SELECT COUNT(*) AS count
        FROM publication.record pr
        WHERE pr.publication_type = 'POST' AND pr.is_hidden = false
      `);

      totalPosts = Number(response[0]?.count) || 0;
      await setRedis(redisKey, totalPosts);
      logger.info(`[Lens] Fetched totalPosts from DB: ${totalPosts}`);
    }

    const totalBatches = Math.ceil(totalPosts / SITEMAP_BATCH_SIZE);
    const entries = Array.from({ length: totalBatches }, (_, index) => ({
      loc: `https://api.hey.xyz/sitemap/posts/${index + 1}.xml`
    }));
    const xml = buildSitemapXml(entries);

    logger.info(
      `[Lens] Fetched all posts sitemap index having ${totalBatches} batches from user-agent: ${userAgent}`
    );

    return res
      .status(200)
      .setHeader("Content-Type", "text/xml")
      .setHeader("Cache-Control", CACHE_AGE_1_DAY)
      .send(xml);
  } catch (error) {
    return catchedError(res, error);
  }
};
