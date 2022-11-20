import axios from 'axios';
import { ERROR_MESSAGE } from 'data/constants';
import type { NextApiRequest, NextApiResponse } from 'next';
import { DATADOG_APPLICATION_KEY, DATADOG_TOKEN } from 'src/constants';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Invalid method!' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Bad request!' });
  }

  try {
    const response = await axios('https://api.datadoghq.eu/api/v2/logs/analytics/aggregate', {
      method: 'POST',
      headers: {
        'dd-api-key': DATADOG_TOKEN,
        'dd-application-key': DATADOG_APPLICATION_KEY
      },
      data: {
        compute: [{ aggregation: 'count', metric: 'count', type: 'total' }],
        filter: {
          from: 'now-15d',
          to: 'now',
          indexes: ['main'],
          query: `@props.path:"Publication page" @props.id:"${id}"`
        }
      }
    });

    const { data } = response?.data;

    return res
      .setHeader('Cache-Control', 's-maxage=900')
      .status(200)
      .json({
        success: true,
        response: {
          views: data?.buckets[0]?.computes?.c0
        }
      });
  } catch (error: any) {
    if (error.response.status === 429) {
      return res.status(429).json({ success: false, message: 'Rate limited' });
    }
    return res.status(500).json({ success: false, message: ERROR_MESSAGE });
  }
};

export default handler;
