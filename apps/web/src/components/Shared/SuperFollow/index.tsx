import { StarIcon } from '@heroicons/react/24/outline';
import { PROFILE } from '@hey/data/tracking';
import type { Profile } from '@hey/lens';
import getProfile from '@hey/lib/getProfile';
import { Button, Modal } from '@hey/ui';
import type { FC } from 'react';
import { lazy, Suspense, useState } from 'react';

import { Leafwatch } from '@/lib/leafwatch';
import { useGlobalModalStateStore } from '@/store/non-persisted/useGlobalModalStateStore';
import useProfileStore from '@/store/persisted/useProfileStore';

import Loader from '../Loader';
import Slug from '../Slug';

const FollowModule = lazy(() => import('./FollowModule'));

interface SuperFollowProps {
  profile: Profile;
  setFollowing: (following: boolean) => void;
  showText?: boolean;
  again?: boolean;

  // For data analytics
  superFollowPosition?: number;
  superFollowSource?: string;
}

const SuperFollow: FC<SuperFollowProps> = ({
  profile,
  setFollowing,
  showText = false,
  again = false,
  superFollowPosition,
  superFollowSource
}) => {
  const [showFollowModal, setShowFollowModal] = useState(false);
  const currentProfile = useProfileStore((state) => state.currentProfile);
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
        {showText ? 'Super follow' : null}
      </Button>
      <Modal
        title={
          <span>
            Super follow <Slug slug={getProfile(profile).slugWithPrefix} />{' '}
            {again ? 'again' : ''}
          </span>
        }
        icon={<StarIcon className="h-5 w-5 text-pink-500" />}
        show={showFollowModal}
        onClose={() => setShowFollowModal(false)}
      >
        <Suspense fallback={<Loader message="Loading Super follow" />}>
          <FollowModule
            profile={profile}
            setFollowing={setFollowing}
            setShowFollowModal={setShowFollowModal}
            again={again}
            superFollowPosition={superFollowPosition}
            superFollowSource={superFollowSource}
          />
        </Suspense>
      </Modal>
    </>
  );
};

export default SuperFollow;
