import { CookiesKeys, cookieStorage } from '@hey/data/cookieStorage';

/**
 * Checks if the access token and refresh token are available in cookieStorage
 *
 * @returns True if the access token and refresh token are available, `false` otherwise
 */
const getIsAuthTokensAvailable = () => {
  const accessToken = cookieStorage.getItem(CookiesKeys.AccessToken);
  const refreshToken = cookieStorage.getItem(CookiesKeys.RefreshToken);
  console.log(accessToken);
  return accessToken !== undefined && refreshToken !== undefined;
};

export default getIsAuthTokensAvailable;
