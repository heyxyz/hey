import lensPg from "@hey/db/lensPg";
import { generateLongExpiry, getRedis, setRedis } from "@hey/db/redisClient";
import logger from "@hey/helpers/logger";
import parseJwt from "@hey/helpers/parseJwt";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { CACHE_AGE_30_MINS } from "src/helpers/constants";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";
import validateLensAccount from "src/helpers/middlewares/validateLensAccount";

interface TransformedRecord {
  date: string;
  likes: number;
  comments: number;
  collects: number;
  mirrors: number;
  quotes: number;
  mentions: number;
  follows: number;
  bookmarks: number;
}

const generateLast30Days = (): string[] => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    days.push(day.toISOString().split("T")[0]);
  }
  return days.reverse();
};

const mapData = (data: any[], key: string): Record<string, number> => {
  return data.reduce((map: Record<string, number>, item) => {
    map[item.date] = Number.parseInt(item[key], 10);
    return map;
  }, {});
};

const transformData = (result: any[][]): TransformedRecord[] => {
  const [
    likesData,
    commentsData,
    collectsData,
    mirrorsData,
    quotesData,
    mentionsData,
    followsData,
    bookmarksData
  ] = result;

  // Generate maps for quick lookup
  const likesMap = mapData(likesData, "likes");
  const commentsMap = mapData(commentsData, "comments");
  const collectsMap = mapData(collectsData, "collects");
  const mirrorsMap = mapData(mirrorsData, "mirrors");
  const quotesMap = mapData(quotesData, "quotes");
  const mentionsMap = mapData(mentionsData, "mentions");
  const followsMap = mapData(followsData, "follows");
  const bookmarksMap = mapData(bookmarksData, "bookmarks");

  console.log(bookmarksData);

  // Transform data for the last 30 days
  const last30Days = generateLast30Days();
  return last30Days.map((date) => ({
    date,
    likes: likesMap[date] || 0,
    comments: commentsMap[date] || 0,
    collects: collectsMap[date] || 0,
    mirrors: mirrorsMap[date] || 0,
    quotes: quotesMap[date] || 0,
    mentions: mentionsMap[date] || 0,
    follows: followsMap[date] || 0,
    bookmarks: bookmarksMap[date] || 0
  }));
};

export const get = [
  rateLimiter({ requests: 250, within: 1 }),
  validateLensAccount,
  async (req: Request, res: Response) => {
    try {
      const identityToken = req.headers["x-identity-token"] as string;
      const payload = parseJwt(identityToken);

      const cacheKey = `analytics:overview:${payload.id}`;
      const cachedData = await getRedis(cacheKey);

      if (cachedData) {
        logger.info(`(cached) Analytics overview fetched for ${payload.id}`);
        return res
          .status(200)
          .setHeader("Cache-Control", CACHE_AGE_30_MINS)
          .json({ result: JSON.parse(cachedData), success: true });
      }

      const result = await lensPg.multi(
        `
          -- Get number of likes per day for the last 30 days
          SELECT TO_CHAR(date_trunc('day', notification_action_date), 'YYYY-MM-DD') AS date, COUNT(*) AS likes
          FROM notification.record
          WHERE notification_type = 'REACTED'
            AND notification_action_date >= NOW() - INTERVAL '30 days'
            AND notification_receiving_profile_id = $1
          GROUP BY date_trunc('day', notification_action_date)
          ORDER BY date;

          -- Get number of comments per day for the last 30 days
          SELECT TO_CHAR(date_trunc('day', notification_action_date), 'YYYY-MM-DD') AS date, COUNT(*) AS comments
          FROM notification.record
          WHERE notification_type = 'COMMENTED'
            AND notification_action_date >= NOW() - INTERVAL '30 days'
            AND notification_receiving_profile_id = $1
          GROUP BY date_trunc('day', notification_action_date)
          ORDER BY date;

          -- Get number of collects per day for the last 30 days
          SELECT TO_CHAR(date_trunc('day', notification_action_date), 'YYYY-MM-DD') AS date, COUNT(*) AS collects
          FROM notification.record
          WHERE notification_type = 'ACTED'
            AND notification_action_date >= NOW() - INTERVAL '30 days'
            AND notification_receiving_profile_id = $1
          GROUP BY date_trunc('day', notification_action_date)
          ORDER BY date;

          -- Get number of mirrors per day for the last 30 days
          SELECT TO_CHAR(date_trunc('day', notification_action_date), 'YYYY-MM-DD') AS date, COUNT(*) AS mirrors
          FROM notification.record
          WHERE notification_type = 'MIRRORED'
            AND notification_action_date >= NOW() - INTERVAL '30 days'
            AND notification_receiving_profile_id = $1
          GROUP BY date_trunc('day', notification_action_date)
          ORDER BY date;

          -- Get number of quotes per day for the last 30 days
          SELECT TO_CHAR(date_trunc('day', notification_action_date), 'YYYY-MM-DD') AS date, COUNT(*) AS quotes
          FROM notification.record
          WHERE notification_type = 'QUOTED'
            AND notification_action_date >= NOW() - INTERVAL '30 days'
            AND notification_receiving_profile_id = $1
          GROUP BY date_trunc('day', notification_action_date)
          ORDER BY date;

          -- Get number of mentions per day for the last 30 days
          SELECT TO_CHAR(date_trunc('day', notification_action_date), 'YYYY-MM-DD') AS date, COUNT(*) AS mentions
          FROM notification.record
          WHERE notification_type = 'MENTIONED'
            AND notification_action_date >= NOW() - INTERVAL '30 days'
            AND notification_receiving_profile_id = $1
          GROUP BY date_trunc('day', notification_action_date)
          ORDER BY date;

          -- Get number of follows per day for the last 30 days
          SELECT TO_CHAR(date_trunc('day', notification_action_date), 'YYYY-MM-DD') AS date, COUNT(*) AS follows
          FROM notification.record
          WHERE notification_type = 'FOLLOWED'
            AND notification_action_date >= NOW() - INTERVAL '30 days'
            AND notification_receiving_profile_id = $1
          GROUP BY date_trunc('day', notification_action_date)
          ORDER BY date;

          -- Get number of bookmarks per day for the last 30 days
          SELECT TO_CHAR(date_trunc('day', bookmarked_at), 'YYYY-MM-DD') AS date, COUNT(*) AS bookmarks
          FROM personalisation.bookmarked_publication
          WHERE bookmarked_at >= NOW() - INTERVAL '30 days'
            AND SPLIT_PART(publication_id, '-', 1) = $1
          GROUP BY date_trunc('day', bookmarked_at)
          ORDER BY date;
        `,
        [payload.id]
      );

      await setRedis(
        cacheKey,
        JSON.stringify(transformData(result)),
        generateLongExpiry()
      );
      logger.info(`Analytics overview fetched for ${payload.id}`);

      return res
        .status(200)
        .setHeader("Cache-Control", CACHE_AGE_30_MINS)
        .json({ result: transformData(result), success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
