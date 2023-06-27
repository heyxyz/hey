import { Localstorage } from '@lenster/data';

const isBrowser = typeof window !== 'undefined';

/**
 * Leafwatch analytics
 */
export const Leafwatch = {
  track: (name: string, properties?: Record<string, unknown>) => {
    if (isBrowser) {
      const user = JSON.parse(
        localStorage.getItem(Localstorage.LensterStore) ||
          JSON.stringify({ state: { profileId: null } })
      );
      try {
        // @ts-ignore
        window?.sa_event?.(name, {
          ...properties,
          actor_id: user.state.profileId
        });
      } catch {
        console.error('Error while sending analytics event to Leafwatch');
      }
    }
  }
};
