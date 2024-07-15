import { hydrateAuthTokens } from 'src/store/persisted/useAuthStore';

const commonHeaders = {
  'X-Identity-Token': hydrateAuthTokens().identityToken
};

/**
 * Get auth api headers
 * @returns Auth api headers
 */
export const getAuthApiHeadersWithAccessToken = () => {
  return {
    'X-Access-Token': hydrateAuthTokens().accessToken,
    ...commonHeaders
  };
};

export const getAuthApiHeaders = () => {
  return commonHeaders;
};
