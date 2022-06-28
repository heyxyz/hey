import { Modal } from '@components/UI/Modal'
import { Profile } from '@generated/types'
import { UsersIcon } from '@heroicons/react/outline'
import humanize from '@lib/humanize'
import React, { FC, useState } from 'react'

import Followers from './Followers'
import Following from './Following'

interface Props {
  followersCount: number
  profile: Profile
}

const Followerings: FC<Props> = ({ followersCount, profile }) => {
  const [showFollowingModal, setShowFollowingModal] = useState<boolean>(false)
  const [showFollowersModal, setShowFollowersModal] = useState<boolean>(false)

  return (
    <div className="flex gap-8">
      <button
        type="button"
        className="text-left"
        onClick={() => setShowFollowingModal(!showFollowingModal)}
        data-test="profile-following"
      >
        <div className="text-xl">
          {humanize(profile?.stats?.totalFollowing)}
        </div>
        <div className="text-gray-500">Following</div>
      </button>
      <button
        type="button"
        className="text-left"
        onClick={() => setShowFollowersModal(!showFollowersModal)}
        data-test="profile-followers"
      >
        <div className="text-xl">{humanize(followersCount)}</div>
        <div className="text-gray-500">Followers</div>
      </button>
      <Modal
        title="Following"
        icon={<UsersIcon className="w-5 h-5 text-brand" />}
        show={showFollowingModal}
        onClose={() => setShowFollowingModal(!showFollowingModal)}
      >
        <Following profile={profile} />
      </Modal>
      <Modal
        title="Followers"
        icon={<UsersIcon className="w-5 h-5 text-brand" />}
        show={showFollowersModal}
        onClose={() => setShowFollowersModal(!showFollowersModal)}
      >
        <Followers profile={profile} />
      </Modal>
    </div>
  )
}

export default Followerings
