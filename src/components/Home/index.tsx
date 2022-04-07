import ExploreFeed from '@components/Explore/Feed'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import Announcement from '@components/Home/Announcement'
import Footer from '@components/Shared/Footer'
import AppContext from '@components/utils/AppContext'
import SEO from '@components/utils/SEO'
import { NextPage } from 'next'
import React, { useContext } from 'react'
import Custom500 from 'src/pages/500'

import HomeFeed from './Feed'
import Hero from './Hero'
import RecommendedProfiles from './RecommendedProfiles'
import SetDefaultProfile from './SetDefaultProfile'
import Streak from './Streak'

const Home: NextPage = () => {
  const { currentUser, currentUserError } = useContext(AppContext)

  if (currentUserError) return <Custom500 />

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
          {currentUser && <SetDefaultProfile />}
          {currentUser && <Streak />}
          <RecommendedProfiles />
          <Footer />
        </GridItemFour>
      </GridLayout>
    </>
  )
}

export default Home
