import { IS_MAINNET } from '@hey/data/constants';
import { Localstorage } from '@hey/data/storage';

import getAuthApiHeaders from './getAuthApiHeaders';

/**
 * Leafwatch analytics
 */
export const Leafwatch = {
  track: (name: string, properties?: Record<string, unknown>) => {
    const { referrer } = document;
    const referrerDomain = referrer ? new URL(referrer).hostname : null;
    const fingerprint = localStorage.getItem(Localstorage.FingerprintStore);

    if (IS_MAINNET && navigator.serviceWorker?.controller) {
      navigator.serviceWorker.controller.postMessage({
        fingerprint: fingerprint || undefined,
        identityToken: getAuthApiHeaders()['X-Identity-Token'] || undefined,
        name,
        platform: 'web',
        properties,
        referrer: referrerDomain,
        type: 'EVENT',
        url: window.location.href
      });
    }
  }
};
