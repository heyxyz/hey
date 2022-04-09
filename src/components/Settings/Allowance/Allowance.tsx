import { CardBody } from '@components/UI/Card'
import { ApprovedAllowanceAmount } from '@generated/types'
import React, { FC } from 'react'

import Module from './Module'

interface Props {
  allowance: any
}

const Allowance: FC<Props> = ({ allowance }) => {
  return (
    <CardBody className="space-y-4">
      {allowance?.approvedModuleAllowanceAmount?.map(
        (item: ApprovedAllowanceAmount, index: number) => (
          <Module key={index} module={item} />
        )
      )}
    </CardBody>
  )
}

export default Allowance
