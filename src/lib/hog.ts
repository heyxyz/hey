import { Dict } from 'mixpanel-browser';
import posthog from 'posthog-js';
import { IS_PRODUCTION, POSTHOG_TOKEN } from 'src/constants';

const enabled = POSTHOG_TOKEN && IS_PRODUCTION;

/**
 * Posthog analytics
 */
export const Hog = {
  track: (name: string, props?: Dict) => {
    if (enabled) {
      posthog.capture(name, props);
    }
  }
};

export const featureEnabled = (feature: string) => {
  if (POSTHOG_TOKEN && typeof window !== 'undefined') {
    return posthog.isFeatureEnabled(feature);
  } else {
    return true;
  }
};

export const posthogInit = () => {
  if (POSTHOG_TOKEN && typeof window !== 'undefined') {
    posthog.init(POSTHOG_TOKEN, {
      api_host: 'https://hog.lenster.xyz',
      capture_pageview: false,
      request_batching: false,
      autocapture: false,
      cookie_name: 'lenster_hog',
      persistence: 'cookie',
      persistence_name: 'lenster_features'
    });
  }
};
