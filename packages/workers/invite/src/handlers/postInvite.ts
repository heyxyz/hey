import { Errors } from '@hey/data/errors';
import LensEndpoint from '@hey/data/lens-endpoints';
import response from '@hey/lib/response';
import { object, string } from 'zod';

import type { WorkerRequest } from '../types';

type ExtensionRequest = {
  address: string;
};

const validationSchema = object({
  address: string()
});

export default async (request: WorkerRequest) => {
  const body = await request.json();
  if (!body) {
    return response({ success: false, error: Errors.NoBody });
  }

  const accessToken = request.headers.get('X-Access-Token');
  const network = request.headers.get('X-Lens-Network');
  if (!accessToken || !network) {
    return response({ success: false, error: Errors.NoProperHeaders });
  }

  const validation = validationSchema.safeParse(body);

  if (!validation.success) {
    return response({ success: false, error: validation.error.issues });
  }

  const { address } = body as ExtensionRequest;
  const isMainnet = network === 'mainnet';

  try {
    const inviteResponse = await fetch(
      isMainnet ? LensEndpoint.Mainnet : LensEndpoint.Testnet,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Token': `Bearer ${accessToken}`,
          'User-agent': 'Hey.xyz'
        },
        body: JSON.stringify({
          query: `
            mutation Invite($request: InviteRequest!) {
              invite(request: $request)
            }
          `,
          variables: {
            request: {
              invites: [address],
              secret: request.env.SHARED_LENS_INVITE_SECRET
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
