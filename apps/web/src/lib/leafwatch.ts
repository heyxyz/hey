import axios from 'axios';
import { RAVEN_WORKER_URL } from 'data/constants';

const isBrowser = typeof window !== 'undefined';

/**
 * Leafwatch analytics
 */
export const Leafwatch = {
  track: (name: string, metadata?: Record<string, any>) => {
    const { state } = JSON.parse(
      localStorage.getItem('lenster.store') || JSON.stringify({ state: { profileId: null } })
    );

    if (isBrowser) {
      axios(RAVEN_WORKER_URL, {
        method: 'POST',
        data: {
          event: name,
          metadata,
          profile: state.profileId,
          url: location.href,
          referrer: document.referrer,
          userAgent: navigator.userAgent,
          ddsource: 'leafwatch'
        }
      }).catch(() => {
        console.error('Error while sending analytics event to Leafwatch');
      });
    }
  }
};
