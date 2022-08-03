import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import Footer from '@components/Shared/Footer'
import PostShimmer from '@components/Shared/Shimmer/PostShimmer'
import PostsShimmer from '@components/Shared/Shimmer/PostsShimmer'
import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer'
import { Card, CardBody } from '@components/UI/Card'
import React, { FC } from 'react'

const PostPageShimmer: FC = () => {
  return (
    <GridLayout>
      <GridItemEight className="space-y-5">
        <Card>
          <PostShimmer />
        </Card>
        <PostsShimmer />
      </GridItemEight>
      <GridItemFour className="space-y-5">
        <Card>
          <CardBody>
            <UserProfileShimmer />
          </CardBody>
        </Card>
        <Card>
          <CardBody className="space-y-4">
            <UserProfileShimmer showFollow />
            <UserProfileShimmer showFollow />
            <UserProfileShimmer showFollow />
            <UserProfileShimmer showFollow />
            <UserProfileShimmer showFollow />
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex justify-between">
            <div className="w-1/2 h-3 rounded-lg shimmer" />
            <div className="w-1/4 h-3 rounded-lg shimmer" />
          </CardBody>
        </Card>
        <Footer />
      </GridItemFour>
    </GridLayout>
  )
}

export default PostPageShimmer
