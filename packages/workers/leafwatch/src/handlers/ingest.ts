import { Errors } from '@hey/data/errors';
import { ALL_EVENTS } from '@hey/data/tracking';
import response from '@hey/lib/response';
import UAParser from 'ua-parser-js';
import urlcat from 'urlcat';
import { any, object, string } from 'zod';

import checkEventExistence from '../helpers/checkEventExistence';
import type { WorkerRequest } from '../types';

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

export default async (request: WorkerRequest) => {
  const body = await request.json();
  if (!body) {
    return response({ success: false, error: Errors.NoBody });
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return response({ success: false, error: validation.error.issues });
  }

  const { name, actor, url, referrer, platform, properties } =
    body as ExtensionRequest;

  if (!checkEventExistence(ALL_EVENTS, name)) {
    return response({ success: false, error: 'Invalid event!' });
  }

  const ip = request.headers.get('cf-connecting-ip');
  const user_agent = request.headers.get('user-agent');

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
          key: request.env.IPAPI_KEY
        })
      );
      ipData = await ipResponse.json();
    } catch {}

    // Extract UTM parameters
    const parsedUrl = new URL(url);
    const utmSource = parsedUrl.searchParams.get('utm_source') || null;
    const utmMedium = parsedUrl.searchParams.get('utm_medium') || null;
    const utmCampaign = parsedUrl.searchParams.get('utm_campaign') || null;
    const utmTerm = parsedUrl.searchParams.get('utm_term') || null;
    const utmContent = parsedUrl.searchParams.get('utm_content') || null;

    const clickhouseResponse = await fetch(
      request.env.CLICKHOUSE_REST_ENDPOINT,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: `
        INSERT INTO events (
          name,
          actor,
          properties,
          url,
          city,
          country,
          region,
          referrer,
          platform,
          browser,
          browser_version,
          os,
          utm_source,
          utm_medium,
          utm_campaign,
          utm_term,
          utm_content
        ) VALUES (
          '${name}',
          ${actor ? `'${actor}'` : null},
          ${properties ? `'${JSON.stringify(properties)}'` : null},
          ${url ? `'${url}'` : null},
          ${ipData?.city ? `'${ipData?.city}'` : null},
          ${ipData?.country ? `'${ipData?.country}'` : null},
          ${ipData?.regionName ? `'${ipData?.regionName}'` : null},
          ${referrer ? `'${referrer}'` : null},
          ${platform ? `'${platform}'` : null},
          ${ua.browser.name ? `'${ua.browser.name}'` : null},
          ${ua.browser.version ? `'${ua.os.version}'` : null},
          ${ua.os.name ? `'${ua.os.name}'` : null},
          ${utmSource ? `'${utmSource}'` : null},
          ${utmMedium ? `'${utmMedium}'` : null},
          ${utmCampaign ? `'${utmCampaign}'` : null},
          ${utmTerm ? `'${utmTerm}'` : null},
          ${utmContent ? `'${utmContent}'` : null}
        )
      `
      }
    );

    if (clickhouseResponse.status !== 200) {
      return response({ success: false, error: Errors.StatusCodeIsNot200 });
    }

    return response({ success: true });
  } catch (error) {
    throw error;
  }
};
