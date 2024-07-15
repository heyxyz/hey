import { HEY_API_URL } from '@hey/data/constants';
import { Localstorage } from '@hey/data/storage';

import { getAuthApiHeadersWithAccessToken } from './getAuthApiHeaders';

let worker: Worker;

if (typeof Worker !== 'undefined') {
  worker = new Worker(new URL('./leafwatchWorker', import.meta.url));
}

/**
 * Leafwatch analytics
 */
export const Leafwatch = {
  track: (name: string, properties?: Record<string, unknown>) => {
    const { referrer } = document;
    const referrerDomain = referrer ? new URL(referrer).hostname : null;
    const fingerprint = localStorage.getItem(Localstorage.FingerprintStore);

    worker.postMessage({
      fingerprint: fingerprint || undefined,
      identityToken:
        getAuthApiHeadersWithAccessToken()['X-Identity-Token'] || undefined,
      name,
      properties,
      referrer: referrerDomain,
      url: window.location.href
    });

    worker.onmessage = (event: MessageEvent) => {
      const response = event.data;
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${HEY_API_URL}/leafwatch/events`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('x-identity-token', response.identityToken);
      xhr.send(JSON.stringify(response));
    };
  }
};
