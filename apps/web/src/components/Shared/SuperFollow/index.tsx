import { Button } from '@components/UI/Button';
import { Modal } from '@components/UI/Modal';
import { StarIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import formatHandle from '@lib/formatHandle';
import { t } from '@lingui/macro';
import type { Profile } from 'lens';
import dynamic from 'next/dynamic';
import type { Dispatch, FC } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useAuthStore } from 'src/store/auth';
import { PROFILE } from 'src/tracking';

import Loader from '../Loader';
import Slug from '../Slug';

const FollowModule = dynamic(() => import('./FollowModule'), {
  loading: () => <Loader message={t`Loading super follow`} />
});

interface Props {
  profile: Profile;
  setFollowing: Dispatch<boolean>;
  showText?: boolean;
  again?: boolean;
}

const SuperFollow: FC<Props> = ({ profile, setFollowing, showText = false, again = false }) => {
  const [showFollowModal, setShowFollowModal] = useState(false);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setShowAuthModal = useAuthStore((state) => state.setShowAuthModal);

  return (
    <>
      <Button
        className="text-sm !px-3 !py-1.5"
        variant="super"
        outline
        onClick={() => {
          if (!currentProfile) {
            setShowAuthModal(true);
            return;
          }
          setShowFollowModal(!showFollowModal);
          Analytics.track(PROFILE.OPEN_SUPER_FOLLOW);
        }}
        aria-label="Super Follow"
        icon={<StarIcon className="w-4 h-4" />}
      >
        {showText && `Super follow`}
      </Button>
      <Modal
        title={
          <span>
            Super follow <Slug slug={formatHandle(profile?.handle)} prefix="@" /> {again ? 'again' : ''}
          </span>
        }
        icon={<StarIcon className="w-5 h-5 text-pink-500" />}
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
