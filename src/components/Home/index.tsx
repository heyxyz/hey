import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import Announcement from '@components/Home/Announcement'
import Footer from '@components/Shared/Footer'
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer'
import Seo from '@components/utils/Seo'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import React from 'react'
import { useAppPersistStore } from 'src/store/app'

import Hero from './Hero'
import ProfileWarning from './ProfileWarning'
import RecommendedProfiles from './RecommendedProfiles'
import SetDefaultProfile from './SetDefaultProfile'
import SetProfile from './SetProfile'
import Streak from './Streak'

const HomeFeed = dynamic(() => import('./Feed'), {
  loading: () => <PublicationsShimmer />
})
const ExploreFeed = dynamic(() => import('@components/Explore/Feed'), {
  loading: () => <PublicationsShimmer />
})

const Home: NextPage = () => {
  const { isConnected, currentUser } = useAppPersistStore()

  return (
    <>
      <Seo />
      {isConnected && !currentUser && <ProfileWarning />}
      {!isConnected && <Hero />}
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
