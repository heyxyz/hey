import { error, type IRequest } from 'itty-router';

import { keysValidator } from '../helpers/keysValidator';
import type { Env } from '../types';

type ExtensionRequest = {
  isMainnet: boolean;
  title: string;
  description: string;
  choices: string[];
  length: number;
};

const requiredKeys: (keyof ExtensionRequest)[] = [
  'isMainnet',
  'title',
  'description',
  'choices',
  'length'
];

export default async (request: IRequest, env: Env) => {
  const body = await request.json();
  if (!body) {
    return error(400, 'Bad request!');
  }

  const { isMainnet, title, description, choices, length } =
    body as ExtensionRequest;

  const missingKeysError = keysValidator(requiredKeys, body);
  if (missingKeysError) {
    return missingKeysError;
  }

  try {
    return new Response(JSON.stringify({ success: true, body }));
  } catch (error) {
    console.error('Failed to get oembed data', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong!' })
    );
  }
};
