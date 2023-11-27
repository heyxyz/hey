import { Errors } from '@hey/data/errors';
import { ALL_EVENTS } from '@hey/data/tracking';
import logger from '@hey/lib/logger';
import catchedError from '@utils/catchedError';
import createClickhouseClient from '@utils/createClickhouseClient';
import checkEventExistence from '@utils/leafwatch/checkEventExistence';
import type { Handler } from 'express';
import requestIp from 'request-ip';
import UAParser from 'ua-parser-js';
import urlcat from 'urlcat';
import { any, object, string } from 'zod';

type ExtensionRequest = {
  name: string;
  actor?: string;
  url: string;
  referrer?: string;
  user_agent?: string;
  platform: 'web' | 'mobile';
  properties?: string;
};

const validationSchema = object({
  name: string().min(1, { message: 'Name is required!' }),
  actor: string().nullable().optional(),
  url: string(),
  referrer: string().nullable().optional(),
  platform: string(),
  properties: any()
});

export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return res.status(400).json({ success: false, error: Errors.NoBody });
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return res.status(400).json({ success: false, error: Errors.InvalidBody });
  }

  const { name, actor, url, referrer, platform, properties } =
    body as ExtensionRequest;

  if (!checkEventExistence(ALL_EVENTS, name)) {
    return res.status(400).json({ success: false, error: 'Invalid event!' });
  }

  const ip = requestIp.getClientIp(req);
  const user_agent = req.headers['user-agent'];

  try {
    // Extract IP data
    const parser = new UAParser(user_agent || '');
    const ua = parser.getResult();
    let ipData: {
      city: string;
      country: string;
      regionName: string;
    } | null = null;

    try {
      const ipResponse = await fetch(
        urlcat('https://pro.ip-api.com/json/:ip', {
          ip,
          key: process.env.IPAPI_KEY
        })
      );
      ipData = await ipResponse.json();
    } catch (error) {
      return catchedError(res, error);
    }

    // Extract UTM parameters
    const parsedUrl = new URL(url);
    const utmSource = parsedUrl.searchParams.get('utm_source') || null;
    const utmMedium = parsedUrl.searchParams.get('utm_medium') || null;
    const utmCampaign = parsedUrl.searchParams.get('utm_campaign') || null;
    const utmTerm = parsedUrl.searchParams.get('utm_term') || null;
    const utmContent = parsedUrl.searchParams.get('utm_content') || null;

    const client = createClickhouseClient();
    const result = await client.insert({
      table: 'events',
      values: [
        {
          name,
          actor: actor || null,
          properties: properties || null,
          url: url || null,
          city: ipData?.city || null,
          country: ipData?.country || null,
          region: ipData?.regionName || null,
          referrer: referrer || null,
          platform: platform || null,
          browser: ua.browser.name || null,
          browser_version: ua.browser.version || null,
          os: ua.os.name || null,
          utm_source: utmSource || null,
          utm_medium: utmMedium || null,
          utm_campaign: utmCampaign || null,
          utm_term: utmTerm || null,
          utm_content: utmContent || null
        }
      ],
      format: 'JSONEachRow'
    });
    logger.info('Ingested event to Leafwatch');

    return res.status(200).json({ success: true, id: result.query_id });
  } catch (error) {
    return catchedError(res, error);
  }
};
