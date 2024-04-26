import type { Handler } from 'express';

import axios from 'axios';
import catchedError from 'src/lib/catchedError';
import { SCORE_WORKER_URL } from 'src/lib/constants';
import createClickhouseClient from 'src/lib/createClickhouseClient';
import heyPrisma from 'src/lib/heyPrisma';
import lensPrisma from 'src/lib/lensPrisma';

const measureQueryTime = async (
  queryFunction: () => Promise<any>
): Promise<[any, bigint]> => {
  const startTime = process.hrtime.bigint();
  const result = await queryFunction();
  const endTime = process.hrtime.bigint();
  return [result, endTime - startTime];
};

export const get: Handler = async (_, res) => {
  try {
    // Prepare promises with timings embedded
    const heyPromise = measureQueryTime(
      () => heyPrisma.$queryRaw<{ count: number }[]>`SELECT 1 as count`
    );
    const lensPromise = measureQueryTime(
      () => lensPrisma.$queryRaw<{ count: number }[]>`SELECT 1 as count`
    );
    const clickhouseClient = createClickhouseClient();
    const clickhousePromise = measureQueryTime(() =>
      clickhouseClient.query({
        format: 'JSONEachRow',
        query: 'SELECT 1 as count'
      })
    );
    const scoreWorkerPromise = measureQueryTime(() =>
      axios.get(SCORE_WORKER_URL, {
        params: { id: '0x0d', secret: process.env.SECRET }
      })
    );

    // Execute all promises simultaneously
    const [heyResult, lensResult, clickhouseResult, scoreWorkerResult] =
      await Promise.all([
        heyPromise,
        lensPromise,
        clickhousePromise,
        scoreWorkerPromise
      ]);

    // Check responses
    const [hey, heyTime] = heyResult;
    const [lens, lensTime] = lensResult;
    const [clickhouseRows, clickhouseTime] = clickhouseResult;
    const [scoreWorker, scoreWorkerTime] = scoreWorkerResult;

    if (
      Number(hey[0].count) !== 1 ||
      Number(lens[0].count) !== 1 ||
      scoreWorker.data.length !== 2 ||
      !clickhouseRows.json
    ) {
      return res.status(500).json({ success: false });
    }

    // Format response times in milliseconds and return
    return res.status(200).json({
      ping: 'pong',
      responseTimes: {
        clickhouse: `${Number(clickhouseTime / BigInt(1000000))}ms`,
        hey: `${Number(heyTime / BigInt(1000000))}ms`,
        lens: `${Number(lensTime / BigInt(1000000))}ms`,
        scoreWorker: `${Number(scoreWorkerTime / BigInt(1000000))}ms`
      }
    });
  } catch (error) {
    return catchedError(res, error);
  }
};
