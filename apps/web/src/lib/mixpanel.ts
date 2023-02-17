import { MIXPANEL_ENABLED } from 'data/constants';
import type { Dict } from 'mixpanel-browser';
import mixpanel from 'mixpanel-browser';

/**
 * Mixpanel analytics
 */
export const Mixpanel = {
  track: (name: string, props?: Dict) => {
    if (MIXPANEL_ENABLED) {
      mixpanel.track(name, props);
    }
  }
};
