import ExploreFeed from '@components/Explore/Feed'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import Landing from '@components/Landing'
import NewPost from '@components/Post/NewPost'
import Footer from '@components/Shared/Footer'
import AppContext from '@components/utils/AppContext'
import { NextPage } from 'next'
import React, { useContext } from 'react'

import HomeFeed from './Feed'
import RecommendedProfiles from './RecommendedProfiles'
import Streak from './Streak'

const Home: NextPage = () => {
  const { currentUser } = useContext(AppContext)

  if (!currentUser) return <Landing />

  return (
    <GridLayout>
      <GridItemEight className="space-y-5">
        {currentUser && <NewPost />}
        {currentUser ? <HomeFeed /> : <ExploreFeed />}
      </GridItemEight>
      <GridItemFour>
        <Streak />
        <RecommendedProfiles />
        <Footer />
      </GridItemFour>
    </GridLayout>
  )
}

export default Home
