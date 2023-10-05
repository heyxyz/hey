import { CookiesKeys, cookieStorage } from '@hey/data/cookieStorage';

/**
 * Resets the auth data
 */
const resetAuthData = () => {
  cookieStorage.removeItem(CookiesKeys.ModeStore);
  cookieStorage.removeItem(CookiesKeys.NotificationStore);
  cookieStorage.removeItem(CookiesKeys.TransactionStore);
  cookieStorage.removeItem(CookiesKeys.TimelineStore);
  cookieStorage.removeItem(CookiesKeys.MessageStore);
  cookieStorage.removeItem(CookiesKeys.AttachmentCache);
  cookieStorage.removeItem(CookiesKeys.AttachmentStore);
  cookieStorage.removeItem(CookiesKeys.NonceStore);
};

export default resetAuthData;
