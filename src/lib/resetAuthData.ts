const resetAuthData = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('lenster.store');
  localStorage.removeItem('transaction.store');
};

export default resetAuthData;
