import axios from 'axios';
import { AXIOM_TOKEN, BIRDSTATS_HOST, IS_PRODUCTION } from 'src/constants';

const enabled = AXIOM_TOKEN && IS_PRODUCTION;

/**
 * Axiom analytics
 */
export const BirdStats = {
  track: (name: string, options?: Record<string, any>) => {
    const { state } = JSON.parse(
      localStorage.getItem('lenster.store') || JSON.stringify({ state: { profileId: null } })
    );

    if (enabled) {
      axios(BIRDSTATS_HOST, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AXIOM_TOKEN}`,
          'Content-Type': 'application/x-ndjson'
        },
        data: {
          event: name,
          profile: state.profileId,
          props: options,
          userAgent: window.navigator.userAgent,
          url: location.href,
          time: new Date()
        }
      });
    }
  }
};
