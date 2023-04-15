import { StarIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import { t } from '@lingui/macro';
import type { Profile } from 'lens';
import formatHandle from 'lib/formatHandle';
import dynamic from 'next/dynamic';
import type { Dispatch, FC } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useAuthStore } from 'src/store/auth';
import { PROFILE } from 'src/tracking';
import { Button, Modal } from 'ui';

import Loader from '../Loader';
import Slug from '../Slug';

const FollowModule = dynamic(() => import('./FollowModule'), {
  loading: () => <Loader message={t`Loading super follow`} />
});

interface SuperFollowProps {
  profile: Profile;
  setFollowing: Dispatch<boolean>;
  showText?: boolean;
  again?: boolean;
}

const SuperFollow: FC<SuperFollowProps> = ({ profile, setFollowing, showText = false, again = false }) => {
  const [showFollowModal, setShowFollowModal] = useState(false);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setShowAuthModal = useAuthStore((state) => state.setShowAuthModal);

  return (
    <>
      <Button
        className="!px-3 !py-1.5 text-sm"
        variant="super"
        outline
        onClick={() => {
          if (!currentProfile) {
            setShowAuthModal(true);
            return;
          }
          setShowFollowModal(!showFollowModal);
          Mixpanel.track(PROFILE.OPEN_SUPER_FOLLOW);
        }}
        aria-label="Super Follow"
        leadingIcon={<StarIcon className="h-4 w-4" />}
      >
        {showText && t`Super follow`}
      </Button>
      <Modal
        title={
          <span>
            Super follow <Slug slug={formatHandle(profile?.handle)} prefix="@" /> {again ? 'again' : ''}
          </span>
        }
        icon={<StarIcon className="h-5 w-5 text-pink-500" />}
        show={showFollowModal}
        onClose={() => setShowFollowModal(false)}
      >
        <FollowModule
          profile={profile}
          setFollowing={setFollowing}
          setShowFollowModal={setShowFollowModal}
          again={again}
        />
      </Modal>
    </>
  );
};

export default SuperFollow;
