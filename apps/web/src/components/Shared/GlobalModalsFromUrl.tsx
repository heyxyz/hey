import { Leafwatch } from "@helpers/leafwatch";
import { AUTH } from "@hey/data/tracking";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useEffect } from "react";
import { useGlobalModalStateStore } from "src/store/non-persisted/useGlobalModalStateStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { useSignupStore } from "./Auth/Signup";

const GlobalModalsFromUrl: FC = () => {
  const { isReady, push, query } = useRouter();
  const { currentAccount } = useAccountStore();
  const { setShowAuthModal } = useGlobalModalStateStore();
  const { setScreen } = useSignupStore();

  useEffect(() => {
    if (isReady && query.signup && !currentAccount?.id) {
      setScreen("choose");
      setShowAuthModal(true, "signup");
      Leafwatch.track(AUTH.OPEN_SIGNUP);

      // Remove query param
      push({ pathname: "/" }, undefined, { shallow: true });
    }
  }, [isReady, query, currentAccount, setScreen, setShowAuthModal, push]);

  return null;
};

export default GlobalModalsFromUrl;
