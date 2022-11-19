import { Button } from '@components/UI/Button';
import { Modal } from '@components/UI/Modal';
import type { Profile } from '@generated/types';
import { StarIcon } from '@heroicons/react/outline';
import { Leafwatch } from '@lib/leafwatch';
import dynamic from 'next/dynamic';
import type { Dispatch, FC } from 'react';
import { useState } from 'react';
import { PROFILE } from 'src/tracking';

import Loader from '../Loader';
import Slug from '../Slug';

const FollowModule = dynamic(() => import('./FollowModule'), {
  loading: () => <Loader message="Loading super follow" />
});

interface Props {
  profile: Profile;
  setFollowing: Dispatch<boolean>;
  showText?: boolean;
  again?: boolean;
}

const SuperFollow: FC<Props> = ({ profile, setFollowing, showText = false, again = false }) => {
  const [showFollowModal, setShowFollowModal] = useState(false);

  return (
    <>
      <Button
        className="text-sm !px-3 !py-1.5"
        variant="super"
        outline
        onClick={() => {
          setShowFollowModal(!showFollowModal);
          Leafwatch.track(PROFILE.OPEN_SUPER_FOLLOW);
        }}
        aria-label="Super Follow"
        icon={<StarIcon className="w-4 h-4" />}
      >
        {showText && `Super follow`}
      </Button>
      <Modal
        title={
          <span>
            Super follow <Slug slug={profile?.handle} prefix="@" /> {again ? 'again' : ''}
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
