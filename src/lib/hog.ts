import { Dict } from 'mixpanel-browser';
import posthog from 'posthog-js';
import { IS_PRODUCTION, POSTHOG_TOKEN } from 'src/constants';

const enabled = POSTHOG_TOKEN && IS_PRODUCTION;

/**
 * Posthog analytics
 */
export const Hog = {
  identify: (id: string, props?: Dict) => {
    if (enabled) {
      posthog.identify(id, props);
    }
  },
  track: (name: string, props?: Dict) => {
    if (enabled) {
      posthog.capture(name, props);
    }
  }
};

export const posthogInit = () => {
  if (enabled && typeof window !== 'undefined') {
    posthog.init(POSTHOG_TOKEN, {
      api_host: 'https://hog.lenster.xyz',
      capture_pageview: false,
      request_batching: false,
      autocapture: false,
      cookie_name: 'lenster_hog',
      debug: true
    });
  }
};
