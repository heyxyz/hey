import type { Request, Response } from 'express';

import axios from 'axios';
import heyPg from 'src/db/heyPg';
import lensPg from 'src/db/lensPg';
import catchedError from 'src/helpers/catchedError';
import { SCORE_WORKER_URL } from 'src/helpers/constants';
import createClickhouseClient from 'src/helpers/createClickhouseClient';
import { rateLimiter } from 'src/helpers/middlewares/rateLimiter';
import { getRedis } from 'src/helpers/redisClient';

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
      const heyPromise = measureQueryTime(() =>
        heyPg.query(`SELECT 1 as count;`)
      );
      const lensPromise = measureQueryTime(() =>
        lensPg.query(`SELECT 1 as count;`)
      );
      const redisPromise = measureQueryTime(() => getRedis('ping'));
      const clickhouseClient = createClickhouseClient();
      const clickhousePromise = measureQueryTime(() =>
        clickhouseClient.query({
          format: 'JSONEachRow',
          query: 'SELECT 1 as count;'
        })
      );
      const scoreWorkerPromise = measureQueryTime(() =>
        axios.get(SCORE_WORKER_URL, {
          params: { id: '0x0d', secret: process.env.SECRET }
        })
      );

      // Execute all promises simultaneously
      const [
        heyResult,
        lensResult,
        redisResult,
        clickhouseResult,
        scoreWorkerResult
      ] = await Promise.all([
        heyPromise,
        lensPromise,
        redisPromise,
        clickhousePromise,
        scoreWorkerPromise
      ]);

      console.log(redisResult);

      // Check responses
      const [hey, heyTime] = heyResult;
      const [lens, lensTime] = lensResult;
      const [redis, redisTime] = redisResult;
      const [clickhouseRows, clickhouseTime] = clickhouseResult;
      const [scoreWorker, scoreWorkerTime] = scoreWorkerResult;

      if (
        Number(hey[0].count) !== 1 ||
        Number(lens[0].count) !== 1 ||
        redis.toString() !== 'pong' ||
        scoreWorker.data.split(' ')[0] !== 'WITH' ||
        !clickhouseRows.json
      ) {
        return res.status(500).json({ success: false });
      }

      // Format response times in milliseconds and return
      return res.status(200).json({
        meta: {
          deployment: process.env.RAILWAY_DEPLOYMENT_ID || 'unknown',
          snapshot: process.env.RAILWAY_SNAPSHOT_ID || 'unknown'
        },
        responseTimes: {
          clickhouse: `${Number(clickhouseTime / BigInt(1000000))}ms`,
          hey: `${Number(heyTime / BigInt(1000000))}ms`,
          lens: `${Number(lensTime / BigInt(1000000))}ms`,
          redis: `${Number(redisTime / BigInt(1000000))}ms`,
          scoreWorker: `${Number(scoreWorkerTime / BigInt(1000000))}ms`
        }
      });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
