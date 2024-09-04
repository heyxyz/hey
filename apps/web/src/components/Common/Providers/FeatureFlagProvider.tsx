import type { FC, ReactNode } from 'react';

import getCurrentSession from '@helpers/getCurrentSession';
import { APP_NAME } from '@hey/data/constants';
import { FlagProvider } from '@unleash/proxy-client-react';

interface FeatureFlagProviderProps {
  children: ReactNode;
}

const FeatureFlagProvider: FC<FeatureFlagProviderProps> = ({ children }) => {
  const { authorizationId, id } = getCurrentSession();

  return (
    <FlagProvider
      config={{
        appName: 'production',
        clientKey: APP_NAME,
        context: { sessionId: authorizationId, userId: id },
        refreshInterval: 15,
        url: 'https://flags.hey.xyz/proxy'
      }}
    >
      {children}
    </FlagProvider>
  );
};

export default FeatureFlagProvider;
