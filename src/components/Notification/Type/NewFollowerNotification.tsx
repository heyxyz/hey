import UserProfile from '@components/Shared/UserProfile'
import WalletProfile from '@components/Shared/WalletProfile'
import { NewFollowerNotification } from '@generated/types'
import React from 'react'

interface Props {
  notification: NewFollowerNotification
}

const NewFollowerNotification: React.FC<Props> = ({ notification }) => {
  return (
    <div className="p-5">
      {notification?.wallet?.defaultProfile ? (
        <UserProfile profile={notification?.wallet?.defaultProfile} />
      ) : (
        <WalletProfile wallet={notification?.wallet} />
      )}
    </div>
  )
}

export default NewFollowerNotification
