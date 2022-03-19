import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import RecommendedProfiles from '@components/Home/RecommendedProfiles'
import Footer from '@components/Shared/Footer'
import { NextPage } from 'next'
import React from 'react'

import Feed from './Feed'

const Explore: NextPage = () => {
  return (
    <GridLayout>
      <GridItemEight className="space-y-5">
        <Feed />
      </GridItemEight>
      <GridItemFour>
        <RecommendedProfiles />
        <Footer />
      </GridItemFour>
    </GridLayout>
  )
}

export default Explore
