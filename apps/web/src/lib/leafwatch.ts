import { HEY_API_URL } from '@hey/data/constants';
import { StackClient } from '@stackso/js-core';

import getCurrentSession from './getCurrentSession';

let worker: Worker;

if (typeof Worker !== 'undefined') {
  worker = new Worker(new URL('./leafwatchWorker', import.meta.url));
}

const stack = new StackClient({
  apiKey: 'bde044ed-8b70-44fc-b31f-65a7c45873da',
  pointSystemId: 691
});

/**
 * Leafwatch analytics
 */
export const Leafwatch = {
  track: async (
    name: string,
    properties?: Record<string, unknown>,
    options?: { points?: number }
  ) => {
    const { points } = options || {};

    const { evmAddress, id: sessionProfileId } = getCurrentSession();
    const { referrer } = document;
    const referrerDomain = referrer ? new URL(referrer).hostname : null;

    worker.postMessage({
      actor: sessionProfileId,
      name,
      platform: 'web',
      properties,
      referrer: referrerDomain,
      url: window.location.href
    });

    worker.onmessage = (event: MessageEvent) => {
      const response = event.data;
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${HEY_API_URL}/leafwatch/events`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(response));
    };

    if (sessionProfileId) {
      await stack.track(name, {
        account: evmAddress,
        metadata: { profile: sessionProfileId },
        points: points || 5
      });
    }
  }
};
