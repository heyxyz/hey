import type { Dict } from 'mixpanel-browser';
import mixpanel from 'mixpanel-browser';
import { IS_PRODUCTION, MIXPANEL_TOKEN } from 'src/constants';

const enabled = MIXPANEL_TOKEN && IS_PRODUCTION;

/**
 * Mixpanel analytics
 */
export const Mixpanel = {
  track: (name: string, props?: Dict) => {
    if (enabled) {
      mixpanel.track(name, props);
    }
  },
  identify: (id: string) => {
    if (enabled) {
      mixpanel.people.set({ $identified_id: id, $name: id });
    }
  }
};
