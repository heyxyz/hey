import { UNLEASH_API_TOKEN } from "@hey/data/constants";
import lensPg from "@hey/db/lensPg";
import prisma from "@hey/db/prisma/db/client";
import { getRedis } from "@hey/db/redisClient";
import axios from "axios";
import type { Request, Response } from "express";
import catchedError from "src/helpers/catchedError";
import { UNLEASH_API_URL } from "src/helpers/constants";
import { rateLimiter } from "src/helpers/middlewares/rateLimiter";

const measureQueryTime = async (
  queryFunction: () => Promise<any>
): Promise<[any, bigint]> => {
  const startTime = process.hrtime.bigint();
  const result = await queryFunction();
  const endTime = process.hrtime.bigint();
  return [result, endTime - startTime];
};

export const get = [
  rateLimiter({ requests: 50, within: 1 }),
  async (_: Request, res: Response) => {
    try {
      // Prepare promises with timings embedded
      const heyPromise = measureQueryTime(
        () => prisma.$queryRaw`SELECT 1 as count;`
      );
      const lensPromise = measureQueryTime(() =>
        lensPg.query("SELECT 1 as count;")
      );
      const redisPromise = measureQueryTime(() => getRedis("ping"));
      const unleashPromise = measureQueryTime(() =>
        axios.get(UNLEASH_API_URL, {
          headers: { Authorization: UNLEASH_API_TOKEN }
        })
      );

      // Execute all promises simultaneously
      const [heyResult, lensResult, redisResult, unleashResult] =
        await Promise.all([
          heyPromise,
          lensPromise,
          redisPromise,
          unleashPromise
        ]);

      // Check responses
      const [hey, heyTime] = heyResult;
      const [lens, lensTime] = lensResult;
      const [redis, redisTime] = redisResult;
      const [unleash, unleashTime] = unleashResult;

      if (
        Number(hey[0].count) !== 1 ||
        Number(lens[0].count) !== 1 ||
        redis.toString() !== "pong" ||
        unleash.data.toggles.length === 0
      ) {
        return res.status(500).json({ success: false });
      }

      // Format response times in milliseconds and return
      return res.status(200).json({
        meta: {
          deployment: process.env.RAILWAY_DEPLOYMENT_ID || "unknown",
          replica: process.env.RAILWAY_REPLICA_ID || "unknown",
          snapshot: process.env.RAILWAY_SNAPSHOT_ID || "unknown"
        },
        responseTimes: {
          hey: `${Number(heyTime / BigInt(1000000))}ms`,
          lens: `${Number(lensTime / BigInt(1000000))}ms`,
          redis: `${Number(redisTime / BigInt(1000000))}ms`,
          unleash: `${Number(unleashTime / BigInt(1000000))}ms`
        }
      });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
