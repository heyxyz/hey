import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import { UsersIcon } from '@heroicons/react/24/outline';
import { PROFILE } from '@hey/data/tracking';
import humanize from '@hey/lib/humanize';
import { Modal } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import plur from 'plur';
import { useState } from 'react';

import Followers from './Followers';
import Following from './Following';

interface FolloweringsProps {
  profile: Profile;
}

const Followerings: FC<FolloweringsProps> = ({ profile }) => {
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);

  return (
    <div className="flex gap-8">
      <button
        className="text-left"
        onClick={() => {
          setShowFollowingModal(!showFollowingModal);
          Leafwatch.track(PROFILE.OPEN_FOLLOWING, {
            profile_id: profile.id
          });
        }}
        type="button"
      >
        <div className="text-xl">{humanize(profile.stats.following)}</div>
        <div className="ld-text-gray-500">
          {plur('Following', profile.stats.following)}
        </div>
      </button>
      <button
        className="text-left"
        onClick={() => {
          setShowFollowersModal(!showFollowersModal);
          Leafwatch.track(PROFILE.OPEN_FOLLOWERS, {
            profile_id: profile.id
          });
        }}
        type="button"
      >
        <div className="text-xl">{humanize(profile.stats.followers)}</div>
        <div className="ld-text-gray-500">
          {plur('Follower', profile.stats.followers)}
        </div>
      </button>
      <Modal
        icon={<UsersIcon className="text-brand-500 size-5" />}
        onClose={() => setShowFollowingModal(false)}
        show={showFollowingModal}
        title="Following"
      >
        <Following profile={profile} />
      </Modal>
      <Modal
        icon={<UsersIcon className="text-brand-500 size-5" />}
        onClose={() => setShowFollowersModal(false)}
        show={showFollowersModal}
        title="Followers"
      >
        <Followers profile={profile} />
      </Modal>
    </div>
  );
};

export default Followerings;
