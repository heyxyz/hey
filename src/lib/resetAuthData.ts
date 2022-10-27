import { LS_KEYS } from 'src/constants';

const resetAuthData = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem(LS_KEYS.LENSTER_STORE);
  localStorage.removeItem(LS_KEYS.TRANSACTION_STORE);
};

export default resetAuthData;
