import axios from 'axios';
import { DATADOG_TOKEN, IS_PRODUCTION, LEAFWATCH_HOST } from 'data/constants';
import { v4 as uuid } from 'uuid';

const enabled = DATADOG_TOKEN && IS_PRODUCTION;
const isBrowser = typeof window !== 'undefined';

/**
 * Leafwatch analytics
 */
export const Leafwatch = {
  track: (name: string, metadata?: Record<string, any>) => {
    const { state } = JSON.parse(
      localStorage.getItem('lenster.store') || JSON.stringify({ state: { profileId: null } })
    );

    if (isBrowser && enabled) {
      axios(LEAFWATCH_HOST, {
        method: 'POST',
        params: {
          'dd-api-key': DATADOG_TOKEN,
          'dd-request-id': uuid()
        },
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
