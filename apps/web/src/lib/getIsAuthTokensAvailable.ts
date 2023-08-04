import { Cookie } from '@lenster/data/storage';
import Cookies from 'js-cookie';

/**
 * Checks if the access token and refresh token are available in cookies.
 *
 * @returns True if the access token and refresh token are available, `false` otherwise
 */
const getIsAuthTokensAvailable = () => {
  const accessToken = Cookies.get(Cookie.AccessToken);
  const refreshToken = Cookies.get(Cookie.RefreshToken);

  return accessToken !== 'undefined' && refreshToken !== 'undefined';
};

export default getIsAuthTokensAvailable;
