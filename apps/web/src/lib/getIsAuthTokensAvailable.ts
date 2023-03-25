/**
 * Checks if the access token and refresh token are available in local storage
 *
 * @returns True if the access token and refresh token are available, `false` otherwise
 */
const getIsAuthTokensAvailable = () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  return accessToken !== 'undefined' && refreshToken !== 'undefined';
};

export default getIsAuthTokensAvailable;
