import type { Handler } from 'express';

import { ALL_EVENTS } from '@hey/data/tracking';
import logger from '@hey/helpers/logger';
import parseJwt from '@hey/helpers/parseJwt';
import requestIp from 'request-ip';
import catchedError from 'src/helpers/catchedError';
import createClickhouseClient from 'src/helpers/createClickhouseClient';
import findEventKeyDeep from 'src/helpers/leafwatch/findEventKeyDeep';
import { invalidBody, noBody } from 'src/helpers/responses';
import UAParser from 'ua-parser-js';
import urlcat from 'urlcat';
import { any, object, string } from 'zod';

type ExtensionRequest = {
  fingerprint?: string;
  name: string;
  platform: 'mobile' | 'web';
  properties?: string;
  referrer?: string;
  url: string;
};

const validationSchema = object({
  fingerprint: string().nullable().optional(),
  name: string().min(1, { message: 'Name is required!' }),
  platform: string(),
  properties: any(),
  referrer: string().nullable().optional(),
  url: string()
});

export const post: Handler = async (req, res) => {
  const { body } = req;

  if (!body) {
    return noBody(res);
  }

  const accessToken = req.headers['x-access-token'] as string;
  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return invalidBody(res);
  }

  const { fingerprint, name, platform, properties, referrer, url } =
    body as ExtensionRequest;

  if (!findEventKeyDeep(ALL_EVENTS, name)?.length) {
    return res.status(400).json({ error: 'Invalid event!', success: false });
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
    const payload = parseJwt(accessToken);

    const client = createClickhouseClient();
    const result = await client.insert({
      format: 'JSONEachRow',
      table: 'events',
      values: [
        {
          actor: payload.id || null,
          browser: ua.browser.name || null,
          browser_version: ua.browser.version || null,
          city: ipData?.city || null,
          country: ipData?.country || null,
          fingerprint: fingerprint || null,
          ip: ip || null,
          name,
          os: ua.os.name || null,
          platform: platform || null,
          properties: properties || null,
          referrer: referrer || null,
          region: ipData?.regionName || null,
          url: url || null,
          utm_campaign: utmCampaign || null,
          utm_content: utmContent || null,
          utm_medium: utmMedium || null,
          utm_source: utmSource || null,
          utm_term: utmTerm || null,
          wallet: payload.evmAddress || null
        }
      ]
    });

    logger.info('Ingested event to Leafwatch');

    return res.status(200).json({ id: result.query_id, success: true });
  } catch (error) {
    return catchedError(res, error);
  }
};
