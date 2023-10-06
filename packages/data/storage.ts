import Cookies from 'js-cookie';

// Localstorage keys
export const Localstorage = {
  AppStore: 'app.store',
  AttachmentStore: 'attachment.store',
  AttachmentCache: 'attachment-cache.store',
  ModeStore: 'mode.store',
  NotificationStore: 'notification.store',
  NonceStore: 'nonce.store',
  PreferencesStore: 'preferences.store',
  TransactionStore: 'transaction.store',
  TimelineStore: 'timeline.store',
  MessageStore: 'message.store',
  LocaleStore: 'locale.store',
  AlgorithmStore: 'algorithm.store'
};

// Cookies keys

export const CookiesKeys = {
  AccessToken: 'accessToken',
  RefreshToken: 'refreshToken'
};

type Keys = keyof typeof CookiesKeys;
export type CookiesKey = (typeof CookiesKeys)[Keys];

class CookieStorage {
  private keys: Set<string> = new Set();

  getItem(key: CookiesKey): string | undefined {
    return Cookies.get(key);
  }

  setItem(key: CookiesKey, value: string): void {
    this.keys.add(key);
    Cookies.set(key, value);
  }

  removeItem(key: string): void {
    this.keys.delete(key);
    Cookies.remove(key);
  }

  clear(): void {
    for (let key of this.keys) {
      this.removeItem(key);
    }
  }
}

export const cookieStorage = new CookieStorage();
