import FullPageLoader from "@components/Shared/FullPageLoader";
import GlobalAlerts from "@components/Shared/GlobalAlerts";
import GlobalBanners from "@components/Shared/GlobalBanners";
import BottomNavigation from "@components/Shared/Navbar/BottomNavigation";
import PageMetatags from "@components/Shared/PageMetatags";
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
import { signOut } from "src/store/persisted/useAuthStore";
import { usePreferencesStore } from "src/store/persisted/usePreferencesStore";
import GlobalModals from "../Shared/GlobalModals";
import Navbar from "../Shared/Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { reload } = useRouter();
  const { resolvedTheme } = useTheme();
  const { currentAccount, setCurrentAccount } = useAccountStore();
  const { resetPreferences } = usePreferencesStore();
  const { resetStatus } = useAccountStatus();
  const isMounted = useIsClient();
  const { address: sessionAccountAddress } = getCurrentSession();

  const logout = (shouldReload = false) => {
    resetPreferences();
    resetStatus();
    signOut();
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
    },
    onError: () => logout(true),
    skip: !sessionAccountAddress
  });

  useEffect(() => {
    if (!sessionAccountAddress) {
      logout();
    }
  }, []);

  const profileLoading = !currentAccount && loading;

  if (profileLoading || !isMounted) {
    return <FullPageLoader />;
  }

  return (
    <main>
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
