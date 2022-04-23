import { GridLayout } from '@components/GridLayout'
import Sponsors from '@components/Shared/Sponsors'
import AppContext from '@components/utils/AppContext'
import SEO from '@components/utils/SEO'
import { NextPage } from 'next'
import React, { useContext } from 'react'

import Hero from './Hero'

const Home: NextPage = () => {
  const { currentUser } = useContext(AppContext)

  return (
    <>
      <SEO />
      {!currentUser && <Hero />}
      <GridLayout>
        <Sponsors></Sponsors>
      </GridLayout>
    </>
  )
}

export default Home
