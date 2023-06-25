import { Localstorage } from '@lenster/data';
import { posthog } from 'posthog-js';

/**
 * PostHog analytics
 */
export const PostHog = {
  track: (name: string, properties?: Record<string, unknown>) => {
    if (window.location.hostname !== 'lenster.xyz') {
      return;
    }

    const user = JSON.parse(
      localStorage.getItem(Localstorage.LensterStore) ||
        JSON.stringify({ state: { profileId: null } })
    );
    const { profileId } = user.state;

    const props = {
      ...(profileId && { $set: { profile_id: user.state.profileId } }),
      ...properties
    };

    posthog.capture(name, props);
  }
};
