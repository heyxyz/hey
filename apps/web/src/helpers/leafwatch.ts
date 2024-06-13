import { GIT_COMMIT_SHA, GOOD_API_URL } from '@good/data/constants';
import { Localstorage } from '@good/data/storage';

import getAuthApiHeaders from './getAuthApiHeaders';

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
      accessToken: getAuthApiHeaders()['X-Identity-Token'] || undefined,
      fingerprint: fingerprint || undefined,
      name,
      network: getAuthApiHeaders()['X-Lens-Network'] || undefined,
      platform: 'web',
      properties,
      referrer: referrerDomain,
      url: window.location.href,
      version: GIT_COMMIT_SHA
    });

    worker.onmessage = (event: MessageEvent) => {
      const response = event.data;
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${GOOD_API_URL}/leafwatch/events`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('x-identity-token', response.accessToken);
      xhr.send(JSON.stringify(response));
    };
  }
};
