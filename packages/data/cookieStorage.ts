import type { CookieAttributes } from 'js-cookie';
import Cookies from 'js-cookie';

export const CookiesKeys = {
  AccessToken: 'accessToken',
  RefreshToken: 'refreshToken',
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
} as const;

type Keys = keyof typeof CookiesKeys;
export type CookiesKey = (typeof CookiesKeys)[Keys];

// Drop-in replacement for localstorage
class CookieStorage {
  private keys: Set<string> = new Set();

  getItem(key: CookiesKey): string | undefined {
    return Cookies.get(key);
  }

  setItem(
    key: CookiesKey,
    value: string,
    attributes: CookieAttributes = { expires: 7, path: '' }
  ): void {
    this.keys.add(key);
    Cookies.set(key, value, attributes);
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
