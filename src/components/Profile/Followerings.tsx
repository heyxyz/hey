import { Modal } from '@components/UI/Modal';
import type { Profile } from '@generated/types';
import { UsersIcon } from '@heroicons/react/outline';
import { Dogstats } from '@lib/dogstats';
import humanize from '@lib/humanize';
import type { FC } from 'react';
import { useState } from 'react';
import { PROFILE } from 'src/tracking';

import Followers from './Followers';
import Following from './Following';

interface Props {
  profile: Profile;
}

const Followerings: FC<Props> = ({ profile }) => {
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);

  return (
    <div className="flex gap-8">
      <button
        type="button"
        className="text-left"
        onClick={() => {
          setShowFollowingModal(!showFollowingModal);
          Dogstats.track(PROFILE.OPEN_FOLLOWING);
        }}
      >
        <div className="text-xl">{humanize(profile?.stats?.totalFollowing)}</div>
        <div className="text-gray-500">Following</div>
      </button>
      <button
        type="button"
        className="text-left"
        onClick={() => {
          setShowFollowersModal(!showFollowersModal);
          Dogstats.track(PROFILE.OPEN_FOLLOWERS);
        }}
      >
        <div className="text-xl">{humanize(profile?.stats?.totalFollowers)}</div>
        <div className="text-gray-500">Followers</div>
      </button>
      <Modal
        title="Following"
        icon={<UsersIcon className="w-5 h-5 text-brand" />}
        show={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
      >
        <Following profile={profile} />
      </Modal>
      <Modal
        title="Followers"
        icon={<UsersIcon className="w-5 h-5 text-brand" />}
        show={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
      >
        <Followers profile={profile} />
      </Modal>
    </div>
  );
};

export default Followerings;
