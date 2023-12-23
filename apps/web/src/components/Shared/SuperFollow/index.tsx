import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import { StarIcon } from '@heroicons/react/24/outline';
import { PROFILE } from '@hey/data/tracking';
import getProfile from '@hey/lib/getProfile';
import { Button, Modal } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import useProfileStore from 'src/store/persisted/useProfileStore';

import Loader from '../Loader';
import Slug from '../Slug';

const FollowModule = dynamic(() => import('./FollowModule'), {
  loading: () => <Loader message="Loading Super follow" />
});

interface SuperFollowProps {
  again?: boolean;
  profile: Profile;
  showText?: boolean;
}

const SuperFollow: FC<SuperFollowProps> = ({
  again = false,
  profile,
  showText = false
}) => {
  const [showFollowModal, setShowFollowModal] = useState(false);
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const setShowAuthModal = useGlobalModalStateStore(
    (state) => state.setShowAuthModal
  );

  return (
    <>
      <Button
        aria-label="Super follow"
        className="!px-3 !py-1.5 text-sm"
        icon={<StarIcon className="size-4" />}
        onClick={() => {
          if (!currentProfile) {
            setShowAuthModal(true);
            return;
          }
          setShowFollowModal(!showFollowModal);
          Leafwatch.track(PROFILE.OPEN_SUPER_FOLLOW);
        }}
        outline
      >
        {showText ? 'Super follow' : null}
      </Button>
      <Modal
        icon={<StarIcon className="size-5 text-pink-500" />}
        onClose={() => setShowFollowModal(false)}
        show={showFollowModal}
        title={
          <span>
            Super follow <Slug slug={getProfile(profile).slugWithPrefix} />{' '}
            {again ? 'again' : ''}
          </span>
        }
      >
        <FollowModule
          again={again}
          profile={profile}
          setShowFollowModal={setShowFollowModal}
        />
      </Modal>
    </>
  );
};

export default SuperFollow;
