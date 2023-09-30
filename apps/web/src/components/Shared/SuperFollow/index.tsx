import { StarIcon } from '@heroicons/react/24/outline';
import { PROFILE } from '@hey/data/tracking';
import type { Profile } from '@hey/lens';
import formatHandle from '@hey/lib/formatHandle';
import { Button, Modal } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { t } from '@lingui/macro';
import dynamic from 'next/dynamic';
import type { FC } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/modals';

import Loader from '../Loader';
import Slug from '../Slug';

const FollowModule = dynamic(() => import('./FollowModule'), {
  loading: () => <Loader message={t`Loading Super follow`} />
});

interface SuperFollowProps {
  profile: Profile;
  setFollowing: (following: boolean) => void;
  showText?: boolean;
  again?: boolean;

  // For data analytics
  followUnfollowPosition?: number;
  followUnfollowSource?: string;
}

const SuperFollow: FC<SuperFollowProps> = ({
  profile,
  setFollowing,
  showText = false,
  again = false,
  followUnfollowPosition,
  followUnfollowSource
}) => {
  const [showFollowModal, setShowFollowModal] = useState(false);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setShowAuthModal = useGlobalModalStateStore(
    (state) => state.setShowAuthModal
  );

  return (
    <>
      <Button
        className="!px-3 !py-1.5 text-sm"
        outline
        onClick={() => {
          if (!currentProfile) {
            setShowAuthModal(true);
            return;
          }
          setShowFollowModal(!showFollowModal);
          Leafwatch.track(PROFILE.OPEN_SUPER_FOLLOW);
        }}
        aria-label="Super follow"
        icon={<StarIcon className="h-4 w-4" />}
      >
        {showText ? t`Super follow` : null}
      </Button>
      <Modal
        title={
          <span>
            Super follow{' '}
            <Slug slug={formatHandle(profile?.handle)} prefix="@" />{' '}
            {again ? 'again' : ''}
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
          followUnfollowPosition={followUnfollowPosition}
          followUnfollowSource={followUnfollowSource}
        />
      </Modal>
    </>
  );
};

export default SuperFollow;
