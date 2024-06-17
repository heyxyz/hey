import type { Handler } from 'express';

import { IS_MAINNET } from '@good/data/constants';
import LensEndpoint from '@good/data/lens-endpoints';
import logger from '@good/helpers/logger';
import axios from 'axios';
import catchedError from 'src/helpers/catchedError';
import {
  GOOD_USER_AGENT,
  SWR_CACHE_AGE_10_MINS_30_DAYS
} from 'src/helpers/constants';
import { invalidBody, noBody } from 'src/helpers/responses';

async function fetchProfileStats(
  profileId: string
): Promise<null | Record<string, number>> {
  const profileStatsQuery = {
    query: `
      query GlobalProfileStats($request: ProfileRequest!, $countOpenActionsRequest2: ProfileStatsCountOpenActionArgs) {
        profile(request: $request) {
          stats {
            posts
            comments
            mirrors
            quotes
            publications
            reacted
            reactions
            collects: countOpenActions(request: $countOpenActionsRequest2)
            acted: countOpenActions
          }
        }
      }
    `,
    variables: {
      countOpenActionsRequest2: {
        anyOf: [
          {
            category: 'COLLECT'
          }
        ]
      },
      request: {
        forProfileId: profileId
      }
    }
  };

  const { data } = await axios.post(
    IS_MAINNET ? LensEndpoint.Mainnet : LensEndpoint.Testnet,
    profileStatsQuery,
    {
      headers: {
        'Content-Type': 'application/json',
        'User-agent': GOOD_USER_AGENT
      }
    }
  );

  const stats: Record<string, number> | undefined = data?.data?.profile?.stats;

  if (!stats) {
    return null;
  }

  const formattedStats: Record<string, number> = {};

  for (const [stat, value] of Object.entries(stats)) {
    formattedStats[`total_${stat}`] = value;
  }

  return formattedStats;
}

// TODO: add tests
export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  if (typeof id !== 'string') {
    return invalidBody(res);
  }

  try {
    const profileStats = await fetchProfileStats(id);

    if (!profileStats) {
      return res.status(404).json({ success: false });
    }

    const result = {
      ...profileStats,
      total_notifications: 0
    };

    logger.info(`Lens: Fetched global profile stats for ${id}`);

    return res
      .status(200)
      .setHeader('Cache-Control', SWR_CACHE_AGE_10_MINS_30_DAYS)
      .json({ result, success: true });
  } catch (error) {
    catchedError(res, error);
  }
};
