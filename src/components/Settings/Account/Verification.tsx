import { Card, CardBody } from '@components/UI/Card'
import AppContext from '@components/utils/AppContext'
import { BadgeCheckIcon } from '@heroicons/react/solid'
import isVerified from '@lib/isVerified'
import React, { FC, useContext } from 'react'

const Verification: FC = () => {
  const { currentUser } = useContext(AppContext)

  return (
    <Card>
      <CardBody className="space-y-2 linkify">
        <div className="text-lg font-bold">Verified</div>
        {isVerified(currentUser?.id) ? (
          <div className="flex items-center space-x-1.5">
            <span>Yes</span>
            <BadgeCheckIcon className="w-5 h-5 text-brand" />
          </div>
        ) : (
          <div>
            No.{' '}
            <a
              href="https://tally.so/r/wgDajK"
              target="_blank"
              rel="noreferrer noopener"
            >
              Request Verification
            </a>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export default Verification
