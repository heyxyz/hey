import { CookieData } from '@hey/data/storage';
import Cookies from 'js-cookie';

/**
 * Resets the auth data
 */
const resetAuthData = () => {
  Cookies.remove(CookieData.ModeStore);
  Cookies.remove(CookieData.NotificationStore);
  Cookies.remove(CookieData.TransactionStore);
  Cookies.remove(CookieData.TimelineStore);
  Cookies.remove(CookieData.MessageStore);
  Cookies.remove(CookieData.AttachmentCache);
  Cookies.remove(CookieData.AttachmentStore);
  Cookies.remove(CookieData.NonceStore);
};

export default resetAuthData;
