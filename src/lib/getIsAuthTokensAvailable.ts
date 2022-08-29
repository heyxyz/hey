const getIsAuthTokensAvailable = () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const isAvailable = accessToken !== 'undefined' && refreshToken !== 'undefined';

  return isAvailable;
};

export default getIsAuthTokensAvailable;
