import axios from 'axios';
import { DATADOG_TOKEN, DOGSTATS_HOST, IS_PRODUCTION } from 'src/constants';
import { v4 as uuid } from 'uuid';

const enabled = DATADOG_TOKEN && IS_PRODUCTION;

/**
 * Datadog analytics
 */
export const Dogstats = {
  track: (name: string, props?: Record<string, any>) => {
    if (enabled) {
      axios(DOGSTATS_HOST, {
        method: 'POST',
        params: {
          'dd-api-key': DATADOG_TOKEN,
          'dd-request-id': uuid()
        },
        data: {
          view: { url: location.href },
          message: name,
          date: new Date(),
          props
        }
      });
    }
  }
};
