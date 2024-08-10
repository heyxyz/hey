import type { Request, Response } from 'express';

import lensPg from '@hey/db/lensPg';
import prisma from '@hey/db/prisma/db/client';
import leafwatch from '@hey/db/prisma/leafwatch/client';
import { getRedis } from '@hey/db/redisClient';
import catchedError from 'src/helpers/catchedError';
import { rateLimiter } from 'src/helpers/middlewares/rateLimiter';

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
        lensPg.query(`SELECT 1 as count;`)
      );
      const redisPromise = measureQueryTime(() => getRedis('ping'));
      const timescalePromise = measureQueryTime(
        () => leafwatch.$queryRaw`SELECT 1 as count;`
      );

      // Execute all promises simultaneously
      const [heyResult, lensResult, redisResult, timescaleResult] =
        await Promise.all([
          heyPromise,
          lensPromise,
          redisPromise,
          timescalePromise
        ]);

      // Check responses
      const [hey, heyTime] = heyResult;
      const [lens, lensTime] = lensResult;
      const [redis, redisTime] = redisResult;
      const [timescale, timescaleTime] = timescaleResult;

      if (
        Number(hey[0].count) !== 1 ||
        Number(lens[0].count) !== 1 ||
        redis.toString() !== 'pong' ||
        Number(timescale[0].count) !== 1
      ) {
        return res.status(500).json({ success: false });
      }

      // Format response times in milliseconds and return
      return res.status(200).json({
        meta: {
          deployment: process.env.RAILWAY_DEPLOYMENT_ID || 'unknown',
          replica: process.env.RAILWAY_REPLICA_ID || 'unknown',
          snapshot: process.env.RAILWAY_SNAPSHOT_ID || 'unknown'
        },
        responseTimes: {
          hey: `${Number(heyTime / BigInt(1000000))}ms`,
          lens: `${Number(lensTime / BigInt(1000000))}ms`,
          redis: `${Number(redisTime / BigInt(1000000))}ms`,
          timescale: `${Number(timescaleTime / BigInt(1000000))}ms`
        }
      });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
