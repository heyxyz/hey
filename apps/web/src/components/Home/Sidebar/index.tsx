import SignupCard from "@components/Shared/Auth/SignupCard";
import Footer from "@components/Shared/Footer";
import { IS_MAINNET } from "@hey/data/constants";
import type { FC } from "react";
import { memo } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import EnableLensManager from "./EnableLensManager";
import HeyMembershipNft from "./HeyMembershipNft";
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
      {loggedOut && <SignupCard />}
      {loggedInWithProfile && IS_MAINNET && <HeyMembershipNft />}
      {/* Onboarding steps */}
      {loggedInWithProfile && (
        <>
          <EnableLensManager />
          <SetAccount />
        </>
      )}
      {/* Recommendations */}
      <StaffPicks />
      {loggedInWithProfile && <WhoToFollow />}
      <Footer />
    </>
  );
};

export default memo(Sidebar);
