import axios from 'axios';
import { DATADOG_TOKEN, IS_PRODUCTION, LEAFWATCH_HOST } from 'src/constants';
import parser from 'ua-parser-js';
import { v4 as uuid } from 'uuid';

import getUserLocale from './getUserLocale';

const enabled = DATADOG_TOKEN && IS_PRODUCTION;
const isBrowser = typeof window !== 'undefined';

/**
 * Leafwatch analytics
 */
export const Leafwatch = {
  track: (name: string, options?: Record<string, any>) => {
    const ua = parser(navigator.userAgent);
    const { state } = JSON.parse(
      localStorage.getItem('lenster.store') || JSON.stringify({ state: { profileId: null } })
    );

    if (isBrowser && enabled) {
      axios(LEAFWATCH_HOST, {
        method: 'POST',
        params: {
          'dd-api-key': DATADOG_TOKEN,
          'dd-evp-origin': 'browser',
          'dd-request-id': uuid()
        },
        data: {
          event: name,
          profile: state.profileId,
          props: options,
          url: location.href,
          referrer: document.referrer,
          sha: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
          browser: {
            name: ua.browser.name,
            version: ua.browser.version,
            language: getUserLocale()
          },
          device: { os: ua.os.name }
        }
      }).catch(() => {
        console.error('Error while sending analytics event to Leafwatch');
      });
    }
  }
};
