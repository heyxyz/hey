const resetAuthData = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('lenster.store');
  localStorage.removeItem('streak');
};

export default resetAuthData;
