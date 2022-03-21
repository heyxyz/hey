import UserProfile from '@components/Shared/UserProfile'
import WalletProfile from '@components/Shared/WalletProfile'
import { Card, CardBody } from '@components/UI/Card'
import { NewFollowerNotification } from '@generated/types'
import React from 'react'

interface Props {
  notification: NewFollowerNotification
}

const NewFollowerNotification: React.FC<Props> = ({ notification }) => {
  return (
    <div>
      <Card>
        <CardBody>
          {notification?.wallet?.defaultProfile ? (
            <UserProfile profile={notification?.wallet?.defaultProfile} />
          ) : (
            <WalletProfile wallet={notification?.wallet} />
          )}
        </CardBody>
      </Card>
    </div>
  )
}

export default NewFollowerNotification
