import { Errors } from '@lenster/data/errors';
import LensEndpoint from '@lenster/data/lens-endpoints';
import { Regex } from '@lenster/data/regex';
import response from '@lenster/lib/response';
import type { IRequest } from 'itty-router';
import { boolean, object, string } from 'zod';

import type { Env } from '../types';

type ExtensionRequest = {
  address: string;
  accessToken: string;
  isMainnet: boolean;
};

const validationSchema = object({
  address: string(),
  accessToken: string().regex(Regex.accessToken),
  isMainnet: boolean()
});

export default async (request: IRequest, env: Env) => {
  const body = await request.json();
  if (!body) {
    return response({ success: false, error: Errors.NoBody });
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return response({ success: false, error: validation.error.issues });
  }

  const { address, accessToken, isMainnet } = body as ExtensionRequest;

  try {
    const mutation = `
      mutation Invite($request: InviteRequest!) {
        invite(request: $request)
      }
    `;
    const inviteResponse = await fetch(
      isMainnet ? LensEndpoint.Mainnet : LensEndpoint.Testnet,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'User-agent': 'Lenster'
        },
        body: JSON.stringify({
          query: mutation,
          variables: {
            request: {
              invites: [address],
              secret: env.SHARED_LENS_INVITE_SECRET
            }
          }
        })
      }
    );

    const inviteResponseJson: {
      errors: any;
    } = await inviteResponse.json();

    if (!inviteResponseJson.errors) {
      return response({ success: true, alreadyInvited: false });
    }

    return response({ success: false, alreadyInvited: true });
  } catch (error) {
    throw error;
  }
};
