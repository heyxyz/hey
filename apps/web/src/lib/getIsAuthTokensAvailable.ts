import { CookieData } from '@hey/data/storage';
import Cookies from 'js-cookie';

/**
 * Checks if the access token and refresh token are available in Cookies
 *
 * @returns True if the access token and refresh token are available, `false` otherwise
 */
const getIsAuthTokensAvailable = () => {
  const accessToken = Cookies.get(CookieData.AccessToken);
  const refreshToken = Cookies.get(CookieData.RefreshToken);

  return accessToken !== 'undefined' && refreshToken !== 'undefined';
};

export default getIsAuthTokensAvailable;
