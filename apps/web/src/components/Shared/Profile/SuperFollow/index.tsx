import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import { Leafwatch } from '@helpers/leafwatch';
import { StarIcon } from '@heroicons/react/24/outline';
import { PROFILE } from '@hey/data/tracking';
import getProfile from '@hey/helpers/getProfile';
import { Button, Modal } from '@hey/ui';
import { useState } from 'react';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import Slug from '../../Slug';
import FollowModule from './FollowModule';

interface SuperFollowProps {
  buttonClassName: string;
  profile: Profile;
  small?: boolean;
  title: string;
}

const SuperFollow: FC<SuperFollowProps> = ({
  buttonClassName,
  profile,
  small = false,
  title
}) => {
  const [showFollowModal, setShowFollowModal] = useState(false);
  const { currentProfile } = useProfileStore();
  const { setShowAuthModal } = useGlobalModalStateStore();

  return (
    <>
      <Button
        aria-label={title}
        className={buttonClassName}
        onClick={() => {
          if (!currentProfile) {
            setShowAuthModal(true);
            return;
          }
          setShowFollowModal(!showFollowModal);
          Leafwatch.track(PROFILE.OPEN_SUPER_FOLLOW);
        }}
        outline
        size={small ? 'sm' : 'md'}
      >
        {title}
      </Button>
      <Modal
        icon={<StarIcon className="size-5" />}
        onClose={() => setShowFollowModal(false)}
        show={showFollowModal}
        title={
          <span>
            Super follow <Slug slug={getProfile(profile).slugWithPrefix} />
          </span>
        }
      >
        <FollowModule
          profile={profile}
          setShowFollowModal={setShowFollowModal}
        />
      </Modal>
    </>
  );
};

export default SuperFollow;
