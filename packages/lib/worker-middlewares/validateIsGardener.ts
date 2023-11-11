import { PREFERENCES_WORKER_URL } from '@hey/data/constants';

import parseJwt from '../parseJwt';
import response from '../response';

/**
 * Middleware to validate if the user is gardener
 * @param request Incoming request
 * @returns Response
 */
const validateIsGardener = async (request: Request) => {
  const accessToken = request.headers.get('X-Access-Token');

  if (!accessToken) {
    return response({ success: false, error: 'No proper headers provided!' });
  }

  const payload = parseJwt(accessToken);

  const workerResponse = await fetch(
    `${PREFERENCES_WORKER_URL}/getIsGardener?id=${payload.id}`,
    { method: 'GET' }
  );

  const json: {
    enabled: boolean;
  } = await workerResponse.json();

  if (!json.enabled) {
    return response({ success: false, error: 'You are not gardener!' });
  }
};

export default validateIsGardener;
