import type { Handler } from 'express';

import logger from '@hey/lib/logger';
import axios from 'axios';
import catchedError from 'src/lib/catchedError';
import { SWR_CACHE_AGE_10_MINS_30_DAYS } from 'src/lib/constants';
import { noBody } from 'src/lib/responses';

// TODO: add tests
export const get: Handler = async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return noBody(res);
  }

  try {
    const id = `${address.toString().toLowerCase()}-0xf618330f51fa54ce5951d627ee150c0fdadeba43-0x3ad736904e9e65189c3000c7dd2c8ac8bb7cd4e3-0.0`;

    const response = await axios.post(
      `https://polygon-mainnet.subgraph.x.superfluid.dev`,
      {
        operationName: 'streams',
        query: `{
            streams(where: { id: "${id}" },
            skip: 0,
            take: 1
          ) {
            createdAtBlockNumber
            createdAtTimestamp
            currentFlowRate
            deposit
          }
        }
        `,
        variables: { id }
      }
    );

    logger.info(`Fetched pro status from Superfluid for ${address}`);

    const result = response.data?.data?.streams[0] || null;

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_10_MINS_30_DAYS)
      .json({ result, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
