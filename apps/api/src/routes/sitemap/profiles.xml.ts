import lensPg from "@hey/db/lensPg";
import { getRedis, setRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { CACHE_AGE_1_DAY, SITEMAP_BATCH_SIZE } from "src/helpers/constants";
import { buildSitemapXml } from "src/helpers/sitemap/buildSitemap";

export const get = async (req: Request, res: Response) => {
  const userAgent = req.headers["user-agent"];
  const redisKey = "sitemap:profiles:total";

  try {
    const cachedData = await getRedis(redisKey);
    let totalHandles: number;

    if (cachedData) {
      totalHandles = Number(cachedData);
      logger.info(`[Lens] Fetched totalHandles from Redis: ${totalHandles}`);
    } else {
      const response = await lensPg.query(`
        SELECT COUNT(*) AS count
        FROM namespace.handle h
        JOIN namespace.handle_link hl ON h.handle_id = hl.handle_id
        JOIN profile.record p ON hl.token_id = p.profile_id
        WHERE p.is_burnt = false;
      `);

      totalHandles = Number(response[0]?.count) || 0;
      await setRedis(redisKey, totalHandles);
      logger.info(`[Lens] Fetched totalHandles from DB: ${totalHandles}`);
    }

    const totalBatches = Math.ceil(totalHandles / SITEMAP_BATCH_SIZE);
    const entries = Array.from({ length: totalBatches }, (_, index) => ({
      loc: `https://api.hey.xyz/sitemap/profiles/${index + 1}.xml`
    }));
    const xml = buildSitemapXml(entries);

    logger.info(
      `[Lens] Fetched all profiles sitemap index having ${totalBatches} batches from user-agent: ${userAgent}`
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
