import { useQuery } from '@apollo/client'
import Feed from '@components/Comment/Feed'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { POST_QUERY } from '@components/Post'
import { PageLoading } from '@components/UI/PageLoading'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import Custom404 from 'src/pages/404'

import Details from './Details'

const ViewCommunity: NextPage = () => {
  const {
    query: { id }
  } = useRouter()
  const { data, loading } = useQuery(POST_QUERY, {
    variables: { request: { publicationId: id } },
    skip: !id
  })

  if (loading || !data) return <PageLoading message="Loading user" />
  if (!data.publication) return <Custom404 />

  return (
    <>
      <GridLayout className="pt-6">
        <GridItemFour>
          <Details community={data.publication} />
        </GridItemFour>
        <GridItemEight className="space-y-5">
          <Feed post={data.publication} />
        </GridItemEight>
      </GridLayout>
    </>
  )
}

export default ViewCommunity
