import axios from 'axios';
import { AXIOM_TOKEN, IS_PRODUCTION, LEAFWATCH_HOST } from 'src/constants';
import parser from 'ua-parser-js';

const enabled = AXIOM_TOKEN && IS_PRODUCTION;

/**
 * Axiom analytics
 */
export const Leafwatch = {
  track: (name: string, options?: Record<string, any>) => {
    const ua = parser(navigator.userAgent);
    const { state } = JSON.parse(
      localStorage.getItem('lenster.store') || JSON.stringify({ state: { profileId: null } })
    );

    if (enabled) {
      axios(LEAFWATCH_HOST, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AXIOM_TOKEN}`,
          'Content-Type': 'application/x-ndjson'
        },
        data: {
          event: name,
          profile: state.profileId,
          props: options,
          url: location.href,
          referrer: document.referrer,
          browser: {
            name: ua.browser.name,
            version: ua.browser.version,
            language: navigator.language
          },
          device: {
            os: ua.os.name,
            screen_height: screen.height,
            screen_width: screen.width
          }
        }
      }).catch(() => {
        console.error('Error while sending analytics event to Leafwatch');
      });
    }
  }
};
