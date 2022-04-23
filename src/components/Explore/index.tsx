import {
  GridItemEight,
  GridItemFour,
  GridLayout,
  GridItemTwo
} from '@components/GridLayout'
import RecommendedProfiles from '@components/Home/RecommendedProfiles'
import Footer from '@components/Shared/Footer'
import SEO from '@components/utils/SEO'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import Dashboard from './Dashboard'
import Feed from './Feed'
import FeedType from './FeedType'

const Explore: NextPage = () => {
  const {
    query: { type }
  } = useRouter()
  const [feedType, setFeedType] = useState<string>(
    type &&
      ['top_commented', 'top_collected', 'latest', 'top_users'].includes(
        type as string
      )
      ? type?.toString().toUpperCase()
      : 'TOP_COMMENTED'
  )

  return (
    <GridLayout>
      <SEO
        title="Explore • Lenster"
        description="Explore top commented, collected and latest publications in the Lenster community."
      />
      {feedType !== 'TOP_USERS' ? (
        <GridItemEight className="space-y-5">
          <FeedType setFeedType={setFeedType} feedType={feedType} />
          <Feed feedType={feedType} />
        </GridItemEight>
      ) : (
        <Dashboard feedType={feedType} />
        // <GridItemTwo className="space-y-5">
        // </GridItemTwo>
      )}
      <GridItemFour>
        <RecommendedProfiles />
        <Footer />
      </GridItemFour>
    </GridLayout>
  )
}

export default Explore
