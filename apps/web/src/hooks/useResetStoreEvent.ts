import { useApolloClient } from '@hey/lens/apollo';
import { useState } from 'react';
import { useEffectOnce } from 'usehooks-ts';

/**
 * This hook listens for the reset store event from Apollo Client and calls the callback when it happens.
 * This is useful when we want to update the UI or refetch queries when the cache store is reset.
 */
export default function useResetStoreEvent(
  callback: () => Promise<void> | void
) {
  const apolloClient = useApolloClient();
  const [isResetting, setIsResetting] = useState(false);

  useEffectOnce(() => {
    const unsubscribe = apolloClient.onResetStore(
      () =>
        new Promise(async () => {
          setIsResetting(true);
          await callback();
          setIsResetting(false);
        })
    );

    return () => {
      unsubscribe();
    };
  });

  return {
    isResettingCache: isResetting
  };
}
