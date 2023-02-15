import { LEAFWATCH_TOKEN, LEAFWATCH_URL } from 'data/constants';
import posthog from 'posthog-js';

const isBrowser = typeof window !== 'undefined';

/**
 * Leafwatch analytics
 */
export const Leafwatch = {
  track: (name: string, metadata?: Record<string, any>) => {
    if (isBrowser) {
      posthog.capture(name, metadata);
    }
  },
  identify: (id: string, metadata?: Record<string, any>) => {
    if (isBrowser) {
      posthog.identify(id, metadata);
    }
  },
  init: () => {
    if (isBrowser) {
      posthog.init(LEAFWATCH_TOKEN, {
        api_host: LEAFWATCH_URL,
        capture_pageview: false,
        request_batching: false,
        autocapture: false,
        cookie_name: 'leafwatch',
        persistence: 'localStorage',
        persistence_name: 'leafwatch_features'
      });
    }
  }
};
