import { Localstorage } from '@lenster/data';

/**
 * Checks if the access token and refresh token are available in local storage
 *
 * @returns True if the access token and refresh token are available, `false` otherwise
 */
const getIsAuthTokensAvailable = () => {
  const accessToken = localStorage.getItem(Localstorage.AccessToken);
  const refreshToken = localStorage.getItem(Localstorage.RefreshToken);
  return accessToken !== 'undefined' && refreshToken !== 'undefined';
};

export default getIsAuthTokensAvailable;
