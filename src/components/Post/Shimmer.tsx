import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import Footer from '@components/Shared/Footer'
import PostShimmer from '@components/Shared/Shimmer/PostShimmer'
import PostsShimmer from '@components/Shared/Shimmer/PostsShimmer'
import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer'
import { Card, CardBody } from '@components/UI/Card'
import React from 'react'

const PostPageShimmer: React.FC = () => {
  return (
    <GridLayout>
      <GridItemEight className="space-y-5">
        <PostShimmer />
        <PostsShimmer />
      </GridItemEight>
      <GridItemFour className="space-y-5">
        <Card>
          <CardBody>
            <UserProfileShimmer />
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex justify-between">
            <div className="h-3 rounded-lg w-1/2 shimmer" />
            <div className="h-3 rounded-lg w-1/4 shimmer" />
          </CardBody>
        </Card>
        <Footer />
      </GridItemFour>
    </GridLayout>
  )
}

export default PostPageShimmer
