import ExploreFeed from '@components/Explore/Feed'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import Footer from '@components/Shared/Footer'
import AppContext from '@components/utils/AppContext'
import { NextPage } from 'next'
import React, { useContext } from 'react'

import HomeFeed from './Feed'
import Hero from './Hero'
import RecommendedProfiles from './RecommendedProfiles'
import Streak from './Streak'

const Home: NextPage = () => {
  const { currentUser } = useContext(AppContext)

  return (
    <>
      {!currentUser && <Hero />}
      <GridLayout>
        <GridItemEight className="space-y-5">
          {currentUser ? <HomeFeed /> : <ExploreFeed />}
        </GridItemEight>
        <GridItemFour>
          {currentUser && <Streak />}
          <RecommendedProfiles />
          <Footer />
        </GridItemFour>
      </GridLayout>
    </>
  )
}

export default Home
