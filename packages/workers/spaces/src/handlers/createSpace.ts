import type { IRequest } from 'itty-router';
import { error } from 'itty-router';

import { keysValidator } from '../helpers/keysValidator';
import type { Env } from '../types';

type ExtensionRequest = {
  subHosts: string[];
  accessToken: string;
};

type CreateRoomResponse = {
  message: string;
  data: {
    roomID: string;
  };
};

const requiredKeys: (keyof ExtensionRequest)[] = ['accessToken'];

export default async (request: IRequest, env: Env) => {
  const body = await request.json();
  if (!body) {
    return error(400, 'Bad request!');
  }

  const { subHosts, accessToken } = body as ExtensionRequest;

  const missingKeysError = keysValidator(requiredKeys, body);
  if (missingKeysError) {
    return missingKeysError;
  }

  try {
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
          hostWallets: subHosts
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
        spaceId: createRoomResponse.data.roomID
      })
    );
  } catch (error) {
    console.error('Failed to create poll', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong!' })
    );
  }
};
