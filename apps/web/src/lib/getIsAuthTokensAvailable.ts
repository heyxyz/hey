import { CookiesKeys, cookieStorage } from '@hey/data/storage';

/**
 * Checks if the access token and refresh token are available in localstorage
 *
 * @returns True if the access token and refresh token are available, `false` otherwise
 */
const getIsAuthTokensAvailable = () => {
  const accessToken = cookieStorage.getItem(CookiesKeys.AccessToken);
  const refreshToken = cookieStorage.getItem(CookiesKeys.RefreshToken);

  return accessToken !== 'undefined' && refreshToken !== 'undefined';
};

export default getIsAuthTokensAvailable;
