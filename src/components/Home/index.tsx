import ExploreFeed from '@components/Explore/Feed'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import Announcement from '@components/Home/Announcement'
import Footer from '@components/Shared/Footer'
import AppContext from '@components/utils/AppContext'
import SEO from '@components/utils/SEO'
import { NextPage } from 'next'
import React, { useContext } from 'react'

import HomeFeed from './Feed'
import Hero from './Hero'
import RecommendedProfiles from './RecommendedProfiles'
import SetDefaultProfile from './SetDefaultProfile'
import SetProfile from './SetProfile'
import Streak from './Streak'

const Home: NextPage = () => {
  const { currentUser } = useContext(AppContext)

  return (
    <>
      <SEO />
      {!currentUser && <Hero />}
      <GridLayout>
        <GridItemEight className="space-y-5">
          {currentUser ? <HomeFeed /> : <ExploreFeed />}
        </GridItemEight>
        <GridItemFour>
          <Announcement />
          {currentUser && (
            <>
              <SetDefaultProfile />
              <SetProfile />
              <Streak />
            </>
          )}
          <RecommendedProfiles />
          <Footer />
        </GridItemFour>
      </GridLayout>
    </>
  )
}

export default Home
