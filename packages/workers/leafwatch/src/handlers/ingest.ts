import { ALL_EVENTS } from '@lenster/data/tracking';
import type { IRequest } from 'itty-router';
import { error } from 'itty-router';
import { object, string } from 'zod';

import type { Env } from '../types';

const checkEventExistence = (obj: any, event: string): boolean => {
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      if (checkEventExistence(obj[key], event)) {
        return true;
      }
    } else if (obj[key] === event) {
      return true;
    }
  }
  return false;
};

type ExtensionRequest = {
  name: string;
};

const validationSchema = object({
  name: string()
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

  const { name } = body as ExtensionRequest;

  if (!checkEventExistence(ALL_EVENTS, name)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid event!' })
    );
  }

  try {
    await fetch(env.CLICKHOUSE_REST_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: `
        INSERT INTO events (actor_id, name, properties, fingerprint, country, referrer, user_agent)
        VALUES ('actor1', '${name}', '{"prop1":"value1", "prop2":"value2"}', 'fingerprint1', 'USA', 'http://example.com', 'Mozilla/5.0');
      `
    });

    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    console.error('Failed to create space', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong!' })
    );
  }
};
