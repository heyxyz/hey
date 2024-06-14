import type { Handler } from 'express';

import { IS_MAINNET } from '@good/data/constants';
import LensEndpoint from '@good/data/lens-endpoints';
import axios from 'axios';
import goodPg from 'src/db/goodPg';
import catchedError from 'src/helpers/catchedError';
import { GOOD_USER_AGENT, SCORE_WORKER_URL } from 'src/helpers/constants';
import createClickhouseClient from 'src/helpers/createClickhouseClient';

const measureQueryTime = async (
  queryFunction: () => Promise<any>
): Promise<[any, bigint]> => {
  const startTime = process.hrtime.bigint();
  const result = await queryFunction();
  const endTime = process.hrtime.bigint();
  return [result, endTime - startTime];
};

const pingLensAPI = async (): Promise<string | unknown> => {
  const pingQuery = {
    query: `
      query Ping {
        ping
      }
    `
  };

  const { data } = await axios.post(
    IS_MAINNET ? LensEndpoint.Mainnet : LensEndpoint.Testnet,
    pingQuery,
    {
      headers: {
        'Content-Type': 'application/json',
        'User-agent': GOOD_USER_AGENT
      }
    }
  );

  return data?.data?.ping;
};

export const get: Handler = async (_, res) => {
  try {
    // Prepare promises with timings embedded
    const goodPromise = measureQueryTime(() =>
      goodPg.query(`SELECT 1 as count;`)
    );
    const lensPromise = measureQueryTime(pingLensAPI);
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
    const [goodResult, lensResult, clickhouseResult, scoreWorkerResult] =
      await Promise.all([
        goodPromise,
        lensPromise,
        clickhousePromise,
        scoreWorkerPromise
      ]);

    // Check responses
    const [good, goodTime] = goodResult;
    const [lens, lensTime] = lensResult;
    const [clickhouseRows, clickhouseTime] = clickhouseResult;
    const [scoreWorker, scoreWorkerTime] = scoreWorkerResult;

    if (
      Number(good[0].count) !== 1 ||
      lens !== 'pong' ||
      scoreWorker.data.split(' ')[0] !== 'WITH' ||
      !clickhouseRows.json
    ) {
      return res.status(500).json({ success: false });
    }

    // Format response times in milliseconds and return
    return res.status(200).json({
      ping: 'pong',
      responseTimes: {
        clickhouse: `${Number(clickhouseTime / BigInt(1000000))}ms`,
        good: `${Number(goodTime / BigInt(1000000))}ms`,
        lens: `${Number(lensTime / BigInt(1000000))}ms`,
        scoreWorker: `${Number(scoreWorkerTime / BigInt(1000000))}ms`
      }
    });
  } catch (error) {
    return catchedError(res, error);
  }
};
