import getCurrentSession from "@helpers/getCurrentSession";
import { UNLEASH_API_TOKEN, UNLEASH_API_URL } from "@hey/data/constants";
import { FlagProvider } from "@unleash/proxy-client-react";
import type { FC, ReactNode } from "react";

interface FeatureFlagProviderProps {
  children: ReactNode;
}

const FeatureFlagProvider: FC<FeatureFlagProviderProps> = ({ children }) => {
  const { authenticationId, address } = getCurrentSession();

  return (
    <FlagProvider
      config={{
        appName: "production",
        environment: "production",
        clientKey: UNLEASH_API_TOKEN,
        context: { sessionId: authenticationId, userId: address },
        refreshInterval: 15,
        url: UNLEASH_API_URL
      }}
    >
      {children}
    </FlagProvider>
  );
};

export default FeatureFlagProvider;
