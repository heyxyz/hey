import axios from 'axios';
import { AXIOM_TOKEN, BIRDSTATS_HOST, IS_PRODUCTION } from 'src/constants';

const enabled = AXIOM_TOKEN && IS_PRODUCTION;

/**
 * Axio analytics
 */
export const BirdStats = {
  track: (name: string, props?: Record<string, any>) => {
    if (true) {
      axios(BIRDSTATS_HOST, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AXIOM_TOKEN}`,
          'Content-Type': 'application/x-ndjson'
        },
        data: {
          url: location.href,
          event: name,
          time: new Date(),
          props
        }
      });
    }
  }
};
