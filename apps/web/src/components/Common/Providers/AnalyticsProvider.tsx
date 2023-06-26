import { IS_PRODUCTION } from '@lenster/data';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import type { FC, ReactNode } from 'react';
import { useEffectOnce } from 'usehooks-ts';

interface AnalyticsProviderProps {
  children: ReactNode;
}

const AnalyticsProvider: FC<AnalyticsProviderProps> = ({ children }) => {
  useEffectOnce(() => {
    posthog.init('phc_GrV2TJaJlKZiHbyI9GBVwxebu1DVYxrKVtySmQD427L', {
      api_host: 'https://lenster.xyz/ingest',
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

export default AnalyticsProvider;
