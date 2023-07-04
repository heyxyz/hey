import { ALL_EVENTS } from '@lenster/data/tracking';
import type { IRequest } from 'itty-router';
import { error } from 'itty-router';
import UAParser from 'ua-parser-js';
import { any, object, string } from 'zod';

import checkEventExistence from '../helpers/checkEventExistence';
import type { Env } from '../types';

type ExtensionRequest = {
  name: string;
  actor?: string;
  fingerprint?: string;
  url?: string;
  referrer?: string;
  user_agent?: string;
  platform?: 'web' | 'mobile';
  properties?: string;
};

const validationSchema = object({
  name: string().min(1, { message: 'Name is required!' }),
  actor: string().nullable().optional(),
  fingerprint: string().nullable().optional(),
  url: string().nullable().optional(),
  referrer: string().nullable().optional(),
  platform: string().nullable().optional(),
  properties: any()
});

export default async (request: IRequest, env: Env) => {
  const body = await request.json();
  if (!body) {
    return error(400, 'Bad request!');
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return new Response(
      JSON.stringify({ success: false, error: validation.error.issues })
    );
  }

  const { name, actor, fingerprint, url, referrer, platform, properties } =
    body as ExtensionRequest;

  if (!checkEventExistence(ALL_EVENTS, name)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid event!' })
    );
  }

  const country = request.headers.get('cf-ipcountry');
  const user_agent = request.headers.get('user-agent');

  try {
    let parser = new UAParser(user_agent || '');
    let ua = parser.getResult();
    const response = await fetch(env.CLICKHOUSE_REST_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: `
        INSERT INTO events (
          name,
          actor,
          properties,
          fingerprint,
          url,
          country,
          referrer,
          platform,
          browser,
          browser_version,
          os
        ) VALUES (
          '${name}',
          ${actor ? `'${actor}'` : null},
          ${properties ? `'${JSON.stringify(properties)}'` : null},
          ${fingerprint ? `'${fingerprint}'` : null},
          ${url ? `'${url}'` : null},
          ${country ? `'${country}'` : null},
          ${referrer ? `'${referrer}'` : null},
          ${platform ? `'${platform}'` : null},
          ${ua.browser.name ? `'${ua.browser.name}'` : null},
          ${ua.browser.version ? `'${ua.os.version}'` : null},
          ${ua.os.name ? `'${ua.os.name}'` : null}
        )
      `
    });

    if (response.status !== 200) {
      return new Response(
        JSON.stringify({ success: false, error: 'Status code is not 200!' })
      );
    }

    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    console.error('Failed to ingest', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong!' })
    );
  }
};
