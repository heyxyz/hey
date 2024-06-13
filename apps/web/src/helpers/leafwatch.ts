import { IS_MAINNET } from '@hey/data/constants';
import { Localstorage } from '@hey/data/storage';

import getAuthApiHeaders from './getAuthApiHeaders';

const eventQueue: Array<{
  name: string;
  properties?: Record<string, unknown>;
}> = [];

const sendMessageToSW = (message: any) => {
  if (typeof navigator !== 'undefined' && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(message);
  } else {
    console.warn('Service Worker controller is not available.');
  }
};

const processQueue = () => {
  while (
    eventQueue.length > 0 &&
    typeof navigator !== 'undefined' &&
    navigator.serviceWorker.controller
  ) {
    const event = eventQueue.shift();
    if (event) {
      sendMessageToSW({
        fingerprint:
          localStorage.getItem(Localstorage.FingerprintStore) || undefined,
        identityToken: getAuthApiHeaders()['X-Identity-Token'] || undefined,
        name: event.name,
        platform: 'web',
        properties: event.properties,
        referrer: document.referrer
          ? new URL(document.referrer).hostname
          : null,
        type: 'EVENT',
        url: window.location.href
      });
    }
  }
};

/**
 * Leafwatch analytics
 */
export const Leafwatch = {
  track: (name: string, properties?: Record<string, unknown>) => {
    const event = { name, properties };
    eventQueue.push(event);

    if (IS_MAINNET && typeof navigator !== 'undefined') {
      if (navigator.serviceWorker.controller) {
        processQueue();
      } else {
        navigator.serviceWorker.ready.then(() => {
          processQueue();
        });
      }
    }
  }
};

// Ensure the service worker is registered correctly if running in the browser
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js', { scope: '/' })
    .catch(console.error);
}
