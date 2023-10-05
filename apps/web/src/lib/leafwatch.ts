import { LEAFWATCH_WORKER_URL } from '@hey/data/constants';
import { CookieData } from '@hey/data/storage';
import Cookies from 'js-cookie';

let worker: Worker;

if (typeof Worker !== 'undefined') {
  worker = new Worker(new URL('./worker', import.meta.url));
}

/**
 * Leafwatch analytics
 */
export const Leafwatch = {
  track: (name: string, properties?: Record<string, unknown>) => {
    const user = JSON.parse(
      Cookies.get(CookieData.AppStore) ||
        JSON.stringify({ state: { profileId: null } })
    );
    const { referrer } = document;
    const referrerDomain = referrer ? new URL(referrer).hostname : null;

    worker.postMessage({
      name,
      properties,
      actor: user.state.profileId,
      referrer: referrerDomain,
      url: window.location.href,
      platform: 'web'
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
