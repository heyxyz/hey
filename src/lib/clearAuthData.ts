import Cookies from 'js-cookie';

const clearAuthData = () => {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
  localStorage.removeItem('lenster.store');
};

export default clearAuthData;
