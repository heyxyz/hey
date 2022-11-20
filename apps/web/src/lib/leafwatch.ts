import axios from 'axios';
import { DATADOG_TOKEN, IS_PRODUCTION, LEAFWATCH_HOST } from 'data/constants';
import { v4 as uuid } from 'uuid';

const enabled = DATADOG_TOKEN && IS_PRODUCTION;
const isBrowser = typeof window !== 'undefined';

/**
 * Leafwatch analytics
 */
export const Leafwatch = {
  track: (name: string, options?: Record<string, any>) => {
    const { state } = JSON.parse(
      localStorage.getItem('lenster.store') || JSON.stringify({ state: { profileId: null } })
    );
    const ip = sessionStorage.getItem('ip');

    if (isBrowser && enabled && ip) {
      axios(LEAFWATCH_HOST, {
        method: 'POST',
        params: { 'dd-api-key': DATADOG_TOKEN, 'dd-request-id': uuid() },
        data: {
          ddsource: 'browser',
          event: name,
          profile: state.profileId,
          props: options,
          url: location.href,
          referrer: document.referrer,
          sha: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
          useragent: navigator.userAgent,
          ip
        }
      }).catch(() => {
        console.error('Error while sending analytics event to Leafwatch');
      });
    }
  }
};
