import { Modal } from '@components/UI/Modal';
import { UsersIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import humanize from '@lib/humanize';
import { t, Trans } from '@lingui/macro';
import type { Profile } from 'lens';
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
          Analytics.track(PROFILE.OPEN_FOLLOWING);
        }}
      >
        <div className="text-xl">{humanize(profile?.stats?.totalFollowing)}</div>
        <div className="lt-text-gray-500">
          <Trans>Following</Trans>
        </div>
      </button>
      <button
        type="button"
        className="text-left"
        onClick={() => {
          setShowFollowersModal(!showFollowersModal);
          Analytics.track(PROFILE.OPEN_FOLLOWERS);
        }}
      >
        <div className="text-xl">{humanize(profile?.stats?.totalFollowers)}</div>
        <div className="lt-text-gray-500">
          <Trans>Followers</Trans>
        </div>
      </button>
      <Modal
        title={t`Following`}
        icon={<UsersIcon className="text-brand h-5 w-5" />}
        show={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
      >
        <Following profile={profile} />
      </Modal>
      <Modal
        title={t`Followers`}
        icon={<UsersIcon className="text-brand h-5 w-5" />}
        show={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
      >
        <Followers profile={profile} />
      </Modal>
    </div>
  );
};

export default Followerings;
