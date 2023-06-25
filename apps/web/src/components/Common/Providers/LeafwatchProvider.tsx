import { IS_PRODUCTION } from '@lenster/data';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import type { FC, ReactNode } from 'react';
import { useEffectOnce } from 'usehooks-ts';

interface LeafwatchProviderProps {
  children: ReactNode;
}

const LeafwatchProvider: FC<LeafwatchProviderProps> = ({ children }) => {
  useEffectOnce(() => {
    posthog.init('phc_f0g6kMcxKrDGaFsKHhRknS7TKURWLWvdaOuo8fNBPwA', {
      api_host: 'https://app.posthog.com',
      request_batching: false,
      autocapture: false,
      capture_pageview: false,
      cookie_name: 'lenster_hog',
      persistence: 'localStorage',
      persistence_name: 'lenster_features',
      loaded: (posthog) => {
        if (!IS_PRODUCTION) {
          posthog.debug();
        }
      }
    });
  });

  useEffectOnce(() => {
    // posthog.se('pageview');
  });

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
};

export default LeafwatchProvider;
