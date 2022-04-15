import { Modal } from '@components/UI/Modal'
import { Profile } from '@generated/types'
import { UsersIcon } from '@heroicons/react/outline'
import humanize from '@lib/humanize'
import React, { FC, useState } from 'react'

import Followers from './Followers'
import Following from './Following'

interface Props {
  profile: Profile
}

const Followerings: FC<Props> = ({ profile }) => {
  const [showFollowingModal, setShowFollowingModal] = useState<boolean>(false)
  const [showFollowersModal, setShowFollowersModal] = useState<boolean>(false)

  return (
    <div className="flex gap-8">
      <button
        type="button"
        className="text-left"
        onClick={() => setShowFollowingModal(!showFollowingModal)}
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
      >
        <div className="text-xl">
          {humanize(profile?.stats?.totalFollowers)}
        </div>
        <div className="text-gray-500">Followers</div>
      </button>
      <Modal
        title="Following"
        icon={<UsersIcon className="w-5 h-5 text-brand-500" />}
        show={showFollowingModal}
        onClose={() => setShowFollowingModal(!showFollowingModal)}
      >
        <Following profile={profile} />
      </Modal>
      <Modal
        title="Followers"
        icon={<UsersIcon className="w-5 h-5 text-brand-500" />}
        show={showFollowersModal}
        onClose={() => setShowFollowersModal(!showFollowersModal)}
      >
        <Followers profile={profile} />
      </Modal>
    </div>
  )
}

export default Followerings
