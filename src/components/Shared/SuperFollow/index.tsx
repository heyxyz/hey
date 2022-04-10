import { Button } from '@components/UI/Button'
import { Modal } from '@components/UI/Modal'
import { Profile } from '@generated/types'
import { StarIcon } from '@heroicons/react/outline'
import dynamic from 'next/dynamic'
import { Dispatch, FC, useState } from 'react'

import Slug from '../Slug'

const FollowModule = dynamic(() => import('./FollowModule'), {
  loading: () => <div className="h-5 m-5 rounded-lg shimmer" />
})

interface Props {
  profile: Profile
  showText?: boolean
  setFollowing: Dispatch<boolean>
}

const SuperFollow: FC<Props> = ({
  profile,
  showText = false,
  setFollowing
}) => {
  const [showFollowModal, setShowFollowModal] = useState<boolean>(false)

  return (
    <>
      <Button
        className="text-sm !px-3 !py-1.5 border-pink-500 hover:bg-pink-100 focus:ring-pink-400 !text-pink-500"
        outline
        onClick={() => setShowFollowModal(!showFollowModal)}
        variant="success"
        icon={<StarIcon className="w-4 h-4" />}
      >
        {showText && 'Super follow'}
      </Button>
      <Modal
        title={
          <span>
            Super follow <Slug slug={profile?.handle} prefix="@" />
          </span>
        }
        icon={<StarIcon className="h-5 w-5 text-pink-500" />}
        show={showFollowModal}
        onClose={() => setShowFollowModal(!showFollowModal)}
      >
        <FollowModule
          profile={profile}
          setFollowing={setFollowing}
          setShowFollowModal={setShowFollowModal}
        />
      </Modal>
    </>
  )
}

export default SuperFollow
