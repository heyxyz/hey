import type { Handler } from 'express';

import LensEndpoint from '@hey/data/lens-endpoints';
import clickhouseClient from '@hey/db/clickhouseClient';
import logger from '@hey/helpers/logger';
import axios from 'axios';
import invoiceRates from 'src/data/invoice-rates';
import catchedError from 'src/helpers/catchedError';
import { HEY_USER_AGENT } from 'src/helpers/constants';
import { noBody } from 'src/helpers/responses';

const getRateForTimestamp = (timestamp: number): number | undefined => {
  const date = new Date(timestamp);

  const rateEntry = invoiceRates.find((rate) => {
    const rateDate = new Date(rate.date);
    return (
      rateDate.getMonth() === date.getMonth() &&
      rateDate.getFullYear() === date.getFullYear()
    );
  });

  return rateEntry ? rateEntry.rate : undefined;
};

export const get: Handler = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return noBody(res);
  }

  try {
    const [rows, lensResponse] = await Promise.all([
      clickhouseClient.query({
        format: 'JSONEachRow',
        query: `
          SELECT city, country
          FROM events
          WHERE 
            actor = '${id}'
            AND city IS NOT NULL
            AND country IS NOT NULL
          ORDER BY created ASC
          LIMIT 1;
        `
      }),
      axios.post(
        LensEndpoint.Mainnet,
        {
          query: `
            query Profile {
              profile(request: { forProfileId: "${id}" }) {
                id
                handle {
                  localName
                }
                metadata {
                  displayName
                }
                createdAt
              }
            }
          `
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'User-agent': HEY_USER_AGENT
          }
        }
      )
    ]);

    const leafwatchData = await rows.json<{
      actor: string;
      city: string;
      country: string;
      created: string;
    }>();

    const lensData = lensResponse.data;

    const lensProfile = {
      createdAt: lensData.data.profile.createdAt,
      id: `SIGNUP-${parseInt(lensData.data.profile.id)}`,
      name:
        lensData?.data.profile.metadata?.displayName ||
        lensData.data.profile.handle?.localName ||
        lensData.data.profile.id
    };

    const rate = getRateForTimestamp(lensData.data.profile.createdAt);

    const result = {
      address:
        leafwatchData[0]?.city && leafwatchData[0]?.country
          ? `${leafwatchData[0].city}, ${leafwatchData[0].country}`
          : 'Others',
      ...lensProfile,
      rate: rate || 600
    };

    logger.info(`Fetched invoice data for ${id}`);

    return res.status(200).json({ result, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
