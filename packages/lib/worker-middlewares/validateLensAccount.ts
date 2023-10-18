import LensEndpoint from '@hey/data/lens-endpoints';

import response from '../response';

/**
 * Middleware to validate Lens access token
 * @param request Incoming request
 * @returns Response
 */
const validateLensAccount = async (request: Request) => {
  const accessToken = request.headers.get('X-Access-Token');
  const network = request.headers.get('X-Lens-Network');
  const allowedNetworks = ['mainnet', 'testnet'];

  if (!accessToken || !network || !allowedNetworks.includes(network)) {
    return response({ success: false, error: 'No proper headers provided!' });
  }

  const isMainnet = network === 'mainnet';

  const lensResponse = await fetch(
    isMainnet ? LensEndpoint.Mainnet : LensEndpoint.Testnet,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-agent': 'Hey.xyz'
      },
      body: JSON.stringify({
        query: `
          query Verify {
            verify(request: { accessToken: "${accessToken}" })
          }
        `
      })
    }
  );

  const json: { data: { verify: boolean } } = await lensResponse.json();

  if (!json.data.verify) {
    return response({ success: false, error: 'Invalid access token!' });
  }
};

export default validateLensAccount;
