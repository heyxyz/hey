import { error, type IRequest } from 'itty-router';
import { Client } from 'pg';

import { keysValidator } from '../helpers/keysValidator';
import type { Env } from '../types';

type ExtensionRequest = {
  name: string;
  user_id?: string;
  fingerprint?: string;
  referrer?: string;
  properties?: string;
};

const requiredKeys: (keyof ExtensionRequest)[] = ['name'];

export default async (request: IRequest, env: Env) => {
  const body = await request.json();
  if (!body) {
    return error(400, 'Bad request!');
  }

  const { name, user_id, fingerprint, referrer, properties } =
    body as ExtensionRequest;

  const missingKeysError = keysValidator(requiredKeys, body);
  if (missingKeysError) {
    return missingKeysError;
  }

  try {
    const client = new Client(env.DB_URL);
    await client.connect();

    const ip = request.headers.get('cf-connecting-ip');
    const country = request.headers.get('cf-ipcountry');
    const userAgent = request.headers.get('user-agent');

    const insertQuery = `
      INSERT INTO events (name, user_id, fingerprint, ip, country, user_agent, referrer, properties)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    await client.query(insertQuery, [
      name,
      user_id,
      fingerprint,
      ip,
      country,
      userAgent,
      referrer,
      properties
    ]);

    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    console.error('Failed to ingest event', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong!' })
    );
  }
};
