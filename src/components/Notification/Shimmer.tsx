import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer'
import { Card, CardBody } from '@components/UI/Card'
import { NextPage } from 'next'
import React from 'react'

import { NotificationWrapper } from '.'

const NotificationShimmer: React.FC = () => {
  return (
    <div>
      <CardBody className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-lg shimmer" />
          <div className="w-1/4 h-3 rounded-lg shimmer" />
        </div>
        <div className="flex justify-between">
          <UserProfileShimmer />
          <div className="w-20 h-3 rounded-lg shimmer" />
        </div>
        <div className="space-y-2">
          <div className="w-7/12 h-3 rounded-lg shimmer" />
          <div className="w-1/3 h-3 rounded-lg shimmer" />
        </div>
      </CardBody>
      <div className="flex gap-7 py-3 px-5 border-t dark:border-gray-800">
        <div className="w-5 h-5 rounded-lg shimmer" />
        <div className="w-5 h-5 rounded-lg shimmer" />
        <div className="w-5 h-5 rounded-lg shimmer" />
      </div>
    </div>
  )
}

const NotificationPageShimmer: NextPage = () => {
  return (
    <NotificationWrapper>
      <Card className="mx-auto">
        <div className="divide-y">
          <NotificationShimmer />
          <div className="p-5">
            <UserProfileShimmer />
          </div>
          <NotificationShimmer />
          <div className="p-5">
            <UserProfileShimmer />
          </div>
        </div>
      </Card>
    </NotificationWrapper>
  )
}

export default NotificationPageShimmer
