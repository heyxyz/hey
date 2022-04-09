import CommunityProfile from '@components/Shared/CommunityProfile'
import { Card, CardBody } from '@components/UI/Card'
import { Community } from '@generated/lenstertypes'
import React, { FC } from 'react'

interface Props {
  communities: Community[]
}

const List: FC<Props> = ({ communities }) => {
  return (
    <Card>
      <CardBody className="space-y-6">
        {communities.map((community: Community, index: number) => (
          <div key={index}>
            <CommunityProfile community={community} />
          </div>
        ))}
      </CardBody>
    </Card>
  )
}

export default List
