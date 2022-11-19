import axios from 'axios';
import { IS_PRODUCTION, LEAFWATCH_HOST } from 'src/constants';

const enabled = IS_PRODUCTION;
const isBrowser = typeof window !== 'undefined';

/**
 * Leafwatch analytics
 */
export const Leafwatch = {
  track: (name: string, options?: Record<string, any>) => {
    const { state } = JSON.parse(
      localStorage.getItem('lenster.store') || JSON.stringify({ state: { profileId: null } })
    );

    if (isBrowser && enabled) {
      axios(LEAFWATCH_HOST, {
        method: 'POST',
        data: {
          ddsource: 'browser',
          event: name,
          profile: state.profileId,
          props: options,
          url: location.href,
          referrer: document.referrer,
          sha: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
          useragent: navigator.userAgent
        }
      }).catch(() => {
        console.error('Error while sending analytics event to Leafwatch');
      });
    }
  }
};
