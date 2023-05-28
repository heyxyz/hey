import { error, type IRequest } from 'itty-router';
import { Client } from 'pg';

import { keysValidator } from '../helpers/keysValidator';
import type { Env } from '../types';

type ExtensionRequest = {
  name: string;
  user_id?: string;
  fingerprint?: string;
  ip?: string;
  city?: string;
  country?: string;
  user_agent?: string;
  referrer?: string;
  properties?: string;
};

const requiredKeys: (keyof ExtensionRequest)[] = ['name'];

export default async (request: IRequest, env: Env) => {
  const body = await request.json();
  if (!body) {
    return error(400, 'Bad request!');
  }

  const {
    name,
    user_id,
    fingerprint,
    ip,
    city,
    country,
    user_agent,
    referrer,
    properties
  } = body as ExtensionRequest;

  const missingKeysError = keysValidator(requiredKeys, body);
  if (missingKeysError) {
    return missingKeysError;
  }

  try {
    const client = new Client(env.DB_URL);
    await client.connect();

    const text = `
      INSERT INTO events (name, user_id, fingerprint, ip, city, country, user_agent, referrer, properties)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    const values = [
      name,
      user_id,
      fingerprint,
      ip,
      city,
      country,
      user_agent,
      referrer,
      properties
    ];
    await client.query(text, values);

    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    console.error('Failed to ingest event', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong!' })
    );
  }
};
