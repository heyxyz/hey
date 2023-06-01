import { LEAFWATCH_WORKER_URL, Localstorage } from '@lenster/data';

let worker: Worker;

if (typeof Worker !== 'undefined') {
  worker = new Worker(new URL('./worker', import.meta.url));
}

/**
 * Leafwatch analytics
 */
export const Leafwatch = {
  track: (name: string, properties?: Record<string, unknown>) => {
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
