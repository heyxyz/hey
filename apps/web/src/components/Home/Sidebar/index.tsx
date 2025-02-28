import SignupCard from "@components/Shared/Auth/SignupCard";
import Footer from "@components/Shared/Footer";
import type { FC } from "react";
import { memo } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import SetAccount from "./SetAccount";
import StaffPicks from "./StaffPicks";
import WhoToFollow from "./WhoToFollow";

const Sidebar: FC = () => {
  const { currentAccount } = useAccountStore();
  const loggedInWithProfile = Boolean(currentAccount);
  const loggedOut = !loggedInWithProfile;

  return (
    <>
      {/* <Gitcoin /> */}
      {loggedOut && <SignupCard />} {/* Onboarding steps */}
      {loggedInWithProfile && <SetAccount />}
      {/* Recommendations */}
      <StaffPicks />
      {loggedInWithProfile && <WhoToFollow />}
      <Footer />
    </>
  );
};

export default memo(Sidebar);
