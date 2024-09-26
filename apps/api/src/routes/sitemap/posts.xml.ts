import lensPg from "@hey/db/lensPg";
import logger from "@hey/helpers/logger";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { CACHE_AGE_1_DAY, SITEMAP_BATCH_SIZE } from "src/helpers/constants";
import { buildSitemapXml } from "src/helpers/sitemap/buildSitemap";

export const get = async (req: Request, res: Response) => {
  const user_agent = req.headers["user-agent"];

  try {
    const response = await lensPg.query(`
      SELECT COUNT(*) AS count
      FROM publication.record pr
      WHERE pr.publication_type = 'POST' AND pr.is_hidden = false
    `);

    const totalPosts = Number(response[0]?.count) || 0;
    const totalBatches = Math.ceil(totalPosts / SITEMAP_BATCH_SIZE);

    const entries = Array.from({ length: totalBatches }, (_, index) => ({
      loc: `https://api.hey.xyz/sitemap/posts/${index + 1}.xml`
    }));
    const xml = buildSitemapXml(entries);

    logger.info(
      `[Lens] Fetched all posts sitemap index having ${totalBatches} batches from user-agent: ${user_agent}`
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
