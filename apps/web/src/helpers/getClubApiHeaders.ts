import { CLUBS_APP_TOKEN } from '@hey/data/constants';
import { hydrateAuthTokens } from 'src/store/persisted/useAuthStore';

/**
 * Get club api headers
 * @returns Club api headers
 */
const getClubApiHeaders = () => {
  return {
    'App-Access-Token': CLUBS_APP_TOKEN,
    'X-Access-Token': `Bearer ${hydrateAuthTokens().accessToken}`
  };
};

export default getClubApiHeaders;
