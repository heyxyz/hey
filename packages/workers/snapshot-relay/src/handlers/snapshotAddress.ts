import type { IRequest } from 'itty-router';
import { error } from 'itty-router';

import getAccount from '../helpers/getAccount';
import type { Env } from '../types';

export default async (request: IRequest, env: Env) => {
  const body = await request.json();
  if (!body) {
    return error(400, 'Bad request, no body');
  }

  if (!body.profileId || !body.token) {
    return error(400, 'Bad request, missing profileId or token');
  }

  const { profileId, token } = body;
  const { address } = await getAccount(token, profileId, env.KEYGEN_HASH);

  return { address };
};
