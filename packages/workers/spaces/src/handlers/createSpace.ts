import { Errors } from '@lenster/data/errors';
import { Regex } from '@lenster/data/regex';
import validateLensAccount from '@lenster/lib/validateLensAccount';
import jwt from '@tsndr/cloudflare-worker-jwt';
import type { IRequest } from 'itty-router';
import { error } from 'itty-router';
import { boolean, object, string } from 'zod';

import type { Env } from '../types';

type ExtensionRequest = {
  accessToken: string;
  isMainnet: boolean;
};

type CreateRoomResponse = {
  message: string;
  data: { roomId: string };
};

const validationSchema = object({
  accessToken: string().regex(Regex.accessToken),
  isMainnet: boolean()
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

  const { accessToken, isMainnet } = body as ExtensionRequest;

  try {
    const isAuthenticated = await validateLensAccount(accessToken, isMainnet);
    if (!isAuthenticated) {
      return new Response(
        JSON.stringify({ success: false, error: Errors.InvalidAccesstoken })
      );
    }

    const { payload } = jwt.decode(accessToken);
    const response = await fetch(
      'https://api.huddle01.com/api/v1/create-room',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.HUDDLE_API_KEY
        },
        body: JSON.stringify({
          title: 'Lenster-Space',
          hostWallets: [payload.id]
        })
      }
    );

    const createRoomResponse: CreateRoomResponse = await response.json();

    if (createRoomResponse.message !== 'Room Created Successfully') {
      return new Response(
        JSON.stringify({ success: false, response: createRoomResponse })
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        spaceId: createRoomResponse.data.roomId
      })
    );
  } catch (error) {
    throw error;
  }
};
