import logger from "@hey/helpers/logger";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { buildSitemapXml } from "src/helpers/sitemap/buildSitemap";

export const get = async (req: Request, res: Response) => {
  const userAgent = req.headers["user-agent"];

  try {
    const sitemaps = [
      "https://api.hey.xyz/sitemap/posts.xml",
      "https://api.hey.xyz/sitemap/profiles.xml",
      "https://api.hey.xyz/sitemap/others.xml"
    ];

    const entries = sitemaps.map((sitemap) => ({
      loc: sitemap
    }));
    const xml = buildSitemapXml(entries);

    logger.info(
      `[Lens] Fetched all sitemaps index from user-agent: ${userAgent}`
    );

    return res.status(200).setHeader("Content-Type", "text/xml").send(xml);
  } catch (error) {
    return catchedError(res, error);
  }
};
