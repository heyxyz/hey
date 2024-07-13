import type { Request, Response } from 'express';

import { ALL_EVENTS } from '@hey/data/tracking';
import getIp from '@hey/helpers/getIp';
import logger from '@hey/helpers/logger';
import parseJwt from '@hey/helpers/parseJwt';
import catchedError from 'src/helpers/catchedError';
import createClickhouseClient from 'src/helpers/createClickhouseClient';
import findEventKeyDeep from 'src/helpers/leafwatch/findEventKeyDeep';
import { rateLimiter } from 'src/helpers/middlewares/rateLimiter';
import { invalidBody, noBody } from 'src/helpers/responses';
import { UAParser } from 'ua-parser-js';
import { any, object, string } from 'zod';

type ExtensionRequest = {
  fingerprint?: string;
  name: string;
  platform: 'mobile' | 'web';
  properties?: string;
  referrer?: string;
  url: string;
  version: string;
};

const validationSchema = object({
  fingerprint: string().nullable().optional(),
  name: string().min(1, { message: 'Name is required!' }),
  platform: string(),
  properties: any(),
  referrer: string().nullable().optional(),
  url: string(),
  version: string().nullable().optional()
});

export const post = [
  rateLimiter({ requests: 250, within: 1 }),
  async (req: Request, res: Response) => {
    const { body } = req;

    if (!body) {
      return noBody(res);
    }

    const validation = validationSchema.safeParse(body);

    if (!validation.success) {
      return invalidBody(res);
    }

    const { fingerprint, name, platform, properties, referrer, url, version } =
      body as ExtensionRequest;

    if (!findEventKeyDeep(ALL_EVENTS, name)?.length) {
      return res.status(400).json({ error: 'Invalid event!', success: false });
    }

    const user_agent = req.headers['user-agent'];
    const ip = getIp(req);
    const cfIpCity = req.headers['cf-ipcity'];
    const cfIpCountry = req.headers['cf-ipcountry'];
    const cfIpRegion = req.headers['cf-region'];

    try {
      // Extract IP data
      const parser = new UAParser(user_agent || '');
      const ua = parser.getResult();

      // Extract UTM parameters
      const parsedUrl = new URL(url);
      const utmSource = parsedUrl.searchParams.get('utm_source') || null;
      const utmMedium = parsedUrl.searchParams.get('utm_medium') || null;
      const utmCampaign = parsedUrl.searchParams.get('utm_campaign') || null;
      const utmTerm = parsedUrl.searchParams.get('utm_term') || null;
      const utmContent = parsedUrl.searchParams.get('utm_content') || null;
      const identityToken = req.headers['x-identity-token'] as string;
      const payload = parseJwt(identityToken);

      const values = {
        actor: payload.id || null,
        browser: ua.browser.name || null,
        browser_version: ua.browser.version || null,
        city: cfIpCity || null,
        country: cfIpCountry || null,
        fingerprint: fingerprint || null,
        ip: ip || null,
        name,
        os: ua.os.name || null,
        platform: platform || null,
        properties: properties || null,
        referrer: referrer || null,
        region: cfIpRegion || null,
        url: url || null,
        utm_campaign: utmCampaign || null,
        utm_content: utmContent || null,
        utm_medium: utmMedium || null,
        utm_source: utmSource || null,
        utm_term: utmTerm || null,
        version: version || null,
        wallet: payload.evmAddress || null
      };

      const client = createClickhouseClient();
      const result = await client.insert({
        format: 'JSONEachRow',
        table: 'events',
        values: [values]
      });

      logger.info(
        `Ingested event to Leafwatch - ${values.name} - ${values.actor}`
      );

      return res.status(200).json({ id: result.query_id, success: true });
    } catch (error) {
      return catchedError(res, error);
    }
  }
];
