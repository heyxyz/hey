import { Card, CardBody } from '@components/UI/Card'
import { Community } from '@generated/lenstertypes'
import React from 'react'

interface Props {
  communities: Community[]
}

const List: React.FC<Props> = ({ communities }) => {
  return (
    <Card>
      <CardBody>{communities.length}</CardBody>
    </Card>
  )
}

export default List
