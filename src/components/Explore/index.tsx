import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import RecommendedProfiles from '@components/Home/RecommendedProfiles'
import Footer from '@components/Shared/Footer'
import { NextPage } from 'next'
import React, { useState } from 'react'

import Feed from './Feed'
import FeedType from './FeedType'

const Explore: NextPage = () => {
  const [feedType, setFeedType] = useState<string>('TOP_COMMENTED')

  return (
    <GridLayout>
      <GridItemEight className="space-y-5">
        <FeedType setFeedType={setFeedType} feedType={feedType} />
        <Feed feedType={feedType} />
      </GridItemEight>
      <GridItemFour>
        <RecommendedProfiles />
        <Footer />
      </GridItemFour>
    </GridLayout>
  )
}

export default Explore
