import { Localstorage } from '@hey/data/storage';

/**
 * Resets the auth data
 */
const resetAuthData = () => {
  localStorage.removeItem(Localstorage.AppStore);
  localStorage.removeItem(Localstorage.ModeStore);
  localStorage.removeItem(Localstorage.NotificationStore);
  localStorage.removeItem(Localstorage.TransactionStore);
  localStorage.removeItem(Localstorage.TimelineStore);
  localStorage.removeItem(Localstorage.AttachmentStore);
  localStorage.removeItem(Localstorage.NonceStore);
  localStorage.removeItem(Localstorage.AccessToken);
  localStorage.removeItem(Localstorage.RefreshToken);
};

export default resetAuthData;
