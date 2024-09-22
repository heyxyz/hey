import getCurrentSession from "@helpers/getCurrentSession";
import { FlagProvider } from "@unleash/proxy-client-react";
import type { FC, ReactNode } from "react";

interface FeatureFlagProviderProps {
  children: ReactNode;
}

const FeatureFlagProvider: FC<FeatureFlagProviderProps> = ({ children }) => {
  const { authorizationId, id } = getCurrentSession();

  return (
    <FlagProvider
      config={{
        appName: "production",
        environment: "production",
        clientKey:
          "*:production.1cc40547dde90e0b342a3dffa825d52a9d9e13597c9dedea480aa9c0",
        context: { sessionId: authorizationId, userId: id },
        refreshInterval: 30,
        url: "https://unleash.hey.xyz/api/frontend"
      }}
    >
      {children}
    </FlagProvider>
  );
};

export default FeatureFlagProvider;
