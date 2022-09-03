import { Dict } from 'mixpanel-browser';
import posthog from 'posthog-js';
import { HOG_ENDPOINT, IS_PRODUCTION, POSTHOG_TOKEN } from 'src/constants';

const enabled = POSTHOG_TOKEN && IS_PRODUCTION && typeof window !== 'undefined';

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
  if (enabled) {
    return posthog.isFeatureEnabled(feature);
  } else {
    return true;
  }
};

export const posthogInit = () => {
  if (enabled) {
    posthog.init(POSTHOG_TOKEN, {
      api_host: HOG_ENDPOINT,
      capture_pageview: false,
      request_batching: false,
      autocapture: false,
      cookie_name: 'lenster_hog',
      persistence: 'localStorage',
      persistence_name: 'lenster_features'
    });
  }
};
