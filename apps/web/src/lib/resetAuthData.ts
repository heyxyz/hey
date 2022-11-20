import { LS_KEYS } from 'data/constants';

const resetAuthData = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem(LS_KEYS.LENSTER_STORE);
  localStorage.removeItem(LS_KEYS.TRANSACTION_STORE);
  localStorage.removeItem(LS_KEYS.TIMELINE_STORE);
  localStorage.removeItem(LS_KEYS.MESSAGE_STORE);
};

export default resetAuthData;
