import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import RecommendedProfiles from '@components/Home/RecommendedProfiles'
import Footer from '@components/Shared/Footer'
import SEO from '@components/utils/SEO'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import Feed from './Feed'
import FeedType from './FeedType'

const Explore: NextPage = () => {
  const {
    query: { type }
  } = useRouter()
  const [feedType, setFeedType] = useState<string>(
    type &&
      ['top_commented', 'top_collected', 'latest'].includes(type as string)
      ? type?.toString().toUpperCase()
      : 'TOP_COMMENTED'
  )

  return (
    <GridLayout>
      <SEO
        title="Explore • Lenster"
        description="Explore top commented, collected and latest publications in the Lenster community."
      />
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
