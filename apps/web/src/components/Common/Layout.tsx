import FullPageLoader from "@components/Shared/FullPageLoader";
import GlobalAlerts from "@components/Shared/GlobalAlerts";
import GlobalBanners from "@components/Shared/GlobalBanners";
import BottomNavigation from "@components/Shared/Navbar/BottomNavigation";
import PageMetatags from "@components/Shared/PageMetatags";
import accountThemeFonts from "@helpers/accountThemeFonts";
import getCurrentSession from "@helpers/getCurrentSession";
import getToastOptions from "@helpers/getToastOptions";
import { type Account, useMeQuery } from "@hey/indexer";
import { useIsClient } from "@uidotdev/usehooks";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import type { FC, ReactNode } from "react";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { useAccountThemeStore } from "src/store/persisted/useAccountThemeStore";
import { hydrateAuthTokens, signOut } from "src/store/persisted/useAuthStore";
import { usePreferencesStore } from "src/store/persisted/usePreferencesStore";
import { useDisconnect } from "wagmi";
import GlobalModals from "../Shared/GlobalModals";
import Navbar from "../Shared/Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { reload } = useRouter();
  const { resolvedTheme } = useTheme();
  const { theme } = useAccountThemeStore();
  const { currentAccount, setCurrentAccount } = useAccountStore();
  const { resetPreferences } = usePreferencesStore();
  const { resetStatus } = useAccountStatus();
  const isMounted = useIsClient();
  const { disconnect } = useDisconnect();
  const { address: sessionAccountAddress } = getCurrentSession();

  const logout = (shouldReload = false) => {
    resetPreferences();
    resetStatus();
    signOut();
    disconnect?.();
    if (shouldReload) {
      reload();
    }
  };

  const { loading } = useMeQuery({
    onCompleted: ({ me }) => {
      setCurrentAccount({
        currentAccount: me.loggedInAs.account as Account,
        isSignlessEnabled: me.isSignless
      });

      // If the profile has no following, we should fallback to the curated feed
      // TODO: Lens v3
      // if (profile?.stats.followers === 0) {
      //   setFallbackToCuratedFeed(true);
      // }
    },
    onError: () => logout(true),
    skip: !sessionAccountAddress
  });

  const validateAuthentication = () => {
    const { accessToken } = hydrateAuthTokens();

    if (!accessToken) {
      logout();
    }
  };

  useEffect(() => {
    validateAuthentication();
  }, []);

  const profileLoading = !currentAccount && loading;

  if (profileLoading || !isMounted) {
    return <FullPageLoader />;
  }

  return (
    <main className={accountThemeFonts(theme?.fontStyle)}>
      <PageMetatags />
      <Toaster
        containerStyle={{ wordBreak: "break-word" }}
        position="bottom-right"
        toastOptions={getToastOptions(resolvedTheme)}
      />
      <GlobalModals />
      <GlobalAlerts />
      <div className="flex min-h-screen flex-col pb-14 md:pb-0">
        <Navbar />
        <GlobalBanners />
        <BottomNavigation />
        {children}
      </div>
    </main>
  );
};

export default Layout;
