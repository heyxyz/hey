import { Dict } from 'mixpanel-browser';
import posthog from 'posthog-js';
import { POSTHOG_TOKEN } from 'src/constants';

const enabled = POSTHOG_TOKEN && true;

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
