import { Button } from '@components/UI/Button'
import { Modal } from '@components/UI/Modal'
import { Profile } from '@generated/types'
import { StarIcon } from '@heroicons/react/outline'
import dynamic from 'next/dynamic'
import { Dispatch, FC, useState } from 'react'

import Slug from '../Slug'

const FollowModule = dynamic(() => import('./FollowModule'), {
  loading: () => <div className="m-5 h-5 rounded-lg shimmer" />
})

interface Props {
  profile: Profile
  setFollowing: Dispatch<boolean>
  showText?: boolean
  again?: boolean
}

const SuperFollow: FC<Props> = ({
  profile,
  setFollowing,
  showText = false,
  again = false
}) => {
  const [showFollowModal, setShowFollowModal] = useState<boolean>(false)

  return (
    <>
      <Button
        className="text-sm !px-3 !py-1.5"
        variant="super"
        outline
        onClick={() => setShowFollowModal(!showFollowModal)}
        icon={<StarIcon className="w-4 h-4" />}
      >
        {showText && `Super follow ${again ? 'again' : ''}`}
      </Button>
      <Modal
        title={
          <span>
            Super follow <Slug slug={profile?.handle} prefix="@" />
          </span>
        }
        icon={<StarIcon className="w-5 h-5 text-pink-500" />}
        show={showFollowModal}
        onClose={() => setShowFollowModal(!showFollowModal)}
      >
        <FollowModule
          profile={profile}
          setFollowing={setFollowing}
          setShowFollowModal={setShowFollowModal}
          again={again}
        />
      </Modal>
    </>
  )
}

export default SuperFollow
