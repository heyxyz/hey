import type { FC } from 'react';

import Footer from '@components/Shared/Footer';
import { memo } from 'react';
import useProfileStore from 'src/store/persisted/useProfileStore';

import EnableLensManager from './EnableLensManager';
import HeyMembershipNft from './HeyMembershipNft';
import SetProfile from './SetProfile';
import StaffPicks from './StaffPicks';
import Waitlist from './Waitlist';
import WhoToFollow from './WhoToFollow';

const Sidebar: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);

  const loggedInWithProfile = Boolean(currentProfile);
  const loggedOut = !loggedInWithProfile;

  return (
    <>
      {/* <Gitcoin /> */}
      {loggedOut && <Waitlist />}
      {loggedInWithProfile && <HeyMembershipNft />}
      {/* Onboarding steps */}
      {loggedInWithProfile && (
        <>
          <EnableLensManager />
          <SetProfile />
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
