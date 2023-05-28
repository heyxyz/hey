import { LEAFWATCH_WORKER_URL, Localstorage } from 'data';
import type { Dict } from 'mixpanel-browser';

let worker: Worker;

if (typeof Worker !== 'undefined') {
  worker = new Worker(new URL('./worker', import.meta.url));
}

/**
 * Leafwatch analytics
 */
export const Mixpanel = {
  track: (name: string, properties?: Dict) => {
    const fingerprint = JSON.parse(
      localStorage.getItem(Localstorage.FingerprintStore) ||
        JSON.stringify({ state: { fingerprint: null } })
    );
    const user = JSON.parse(
      localStorage.getItem(Localstorage.LensterStore) ||
        JSON.stringify({ state: { profileId: null } })
    );
    const { referrer } = document;
    const referrerDomain = referrer ? new URL(referrer).hostname : null;

    worker.postMessage({
      name,
      properties,
      user_id: user.state.profileId,
      fingerprint: fingerprint.state.fingerprint,
      referrer: referrerDomain
    });

    worker.onmessage = function (event: MessageEvent) {
      const response = event.data;
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${LEAFWATCH_WORKER_URL}/ingest`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(response));
    };
  }
};
