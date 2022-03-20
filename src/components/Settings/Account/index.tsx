import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import AppContext from '@components/utils/AppContext'
import { NextPage } from 'next'
import React, { useContext } from 'react'
import Custom404 from 'src/pages/404'

import Sidebar from '../Sidebar'
import SetProfile from './SetProfile'

const AccountSettings: NextPage = () => {
  const { currentUser } = useContext(AppContext)

  if (!currentUser) return <Custom404 />

  return (
    <GridLayout>
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <SetProfile />
      </GridItemEight>
    </GridLayout>
  )
}

export default AccountSettings
