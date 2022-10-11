import axios from 'axios';
import { AXIOM_TOKEN, BIRDSTATS_HOST, IS_PRODUCTION } from 'src/constants';

const enabled = AXIOM_TOKEN && IS_PRODUCTION;

/**
 * Axio analytics
 */
export const BirdStats = {
  track: (name: string, props?: Record<string, any>) => {
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
          url: location.href,
          event: name,
          profile: state.profileId,
          time: new Date(),
          props
        }
      });
    }
  }
};
