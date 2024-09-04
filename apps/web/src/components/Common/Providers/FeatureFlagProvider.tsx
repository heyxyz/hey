import type { FC, ReactNode } from 'react';

import getCurrentSession from '@helpers/getCurrentSession';
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
        clientKey: 'yoginth',
        context: { sessionId: authorizationId, userId: id },
        refreshInterval: 15,
        url: 'https://accurate-friendship-mainnet.up.railway.app/proxy'
      }}
    >
      {children}
    </FlagProvider>
  );
};

export default FeatureFlagProvider;
