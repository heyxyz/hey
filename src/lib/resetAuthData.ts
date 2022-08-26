import Cookies from 'js-cookie';

const resetAuthData = () => {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
  localStorage.removeItem('lenster.store');
  localStorage.removeItem('streak');
};

export default resetAuthData;
