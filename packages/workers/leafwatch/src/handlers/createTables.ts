import { error, type IRequest } from 'itty-router';
import { Client } from 'pg';

import { keysValidator } from '../helpers/keysValidator';
import type { Env } from '../types';

type ExtensionRequest = {
  secret: string;
};

const requiredKeys: (keyof ExtensionRequest)[] = ['secret'];

export default async (request: IRequest, env: Env) => {
  const body = await request.json();
  if (!body) {
    return error(400, 'Bad request!');
  }

  const { secret } = body as ExtensionRequest;

  const missingKeysError = keysValidator(requiredKeys, body);
  if (missingKeysError) {
    return missingKeysError;
  }

  if (secret !== env.SECRET) {
    return error(401, 'Unauthorized!');
  }

  try {
    const client = new Client(env.DB_URL);
    await client.connect();
    const result = await client.query({
      text: `
        DROP TABLE IF EXISTS events CASCADE;
        CREATE TABLE events (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          time TIMESTAMP DEFAULT NOW(),
          user_id VARCHAR(255),
          fingerprint VARCHAR(255),
          ip VARCHAR(255),
          country VARCHAR(255),
          user_agent VARCHAR(255),
          referrer VARCHAR(255),
          properties JSONB
        );
      `
    });

    return new Response(JSON.stringify({ success: true, result }));
  } catch (error) {
    console.error('Failed to create tables', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong!' })
    );
  }
};
