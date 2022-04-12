import Slug from '@components/Shared/Slug'
import { Card, CardBody } from '@components/UI/Card'
import { Mirror } from '@generated/types'
import { HeartIcon } from '@heroicons/react/outline'
import React, { FC } from 'react'

interface Props {
  mirror: Mirror
  referralFee?: string
}

const ReferralAlert: FC<Props> = ({ mirror, referralFee = 0 }) => {
  if (referralFee === 0) return null

  return (
    <Card className="!bg-green-100/80 border-green-300 mb-5">
      <CardBody className="flex items-center space-x-1.5 text-sm font-bold text-gray-500">
        <HeartIcon className="w-4 h-4 text-green-500" />
        <Slug slug={mirror?.profile?.handle} prefix="@" />
        <span>
          {' '}
          will get <b>{referralFee}%</b> referral fee
        </span>
      </CardBody>
    </Card>
  )
}

export default ReferralAlert
