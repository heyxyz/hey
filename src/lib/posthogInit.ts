import posthog from 'posthog-js';
import { POSTHOG_TOKEN } from 'src/constants';

const posthogInit = () => {
  if (POSTHOG_TOKEN && typeof window !== 'undefined') {
    posthog.init(POSTHOG_TOKEN, {
      api_host: 'https://hog.lenster.xyz',
      capture_pageview: false,
      request_batching: false,
      autocapture: false,
      cookie_name: 'lenster_hog'
    });
  }
};

export default posthogInit;
