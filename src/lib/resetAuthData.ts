const resetAuthData = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('lenster.store');
  localStorage.removeItem('publication.store');
};

export default resetAuthData;
