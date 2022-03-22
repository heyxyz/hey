import { gql, useQuery } from '@apollo/client'
import Feed from '@components/Comment/Feed'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { PageLoading } from '@components/UI/PageLoading'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import Custom404 from 'src/pages/404'

import Details from './Details'

export const COMMUNITY_QUERY = gql`
  query Post($request: PublicationQueryRequest!) {
    publication(request: $request) {
      ... on Post {
        pubId: id
        metadata {
          name
          description
          content
          attributes {
            traitType
            value
          }
          cover {
            original {
              url
            }
          }
        }
      }
    }
  }
`

const ViewCommunity: NextPage = () => {
  const {
    query: { id }
  } = useRouter()
  const { data, loading } = useQuery(COMMUNITY_QUERY, {
    variables: { request: { publicationId: id } },
    skip: !id
  })

  if (loading || !data) return <PageLoading message="Loading community" />
  if (
    !data.publication ||
    data.publication?.metadata?.attributes[0]?.value !== 'community'
  )
    return <Custom404 />

  return (
    <GridLayout className="pt-6">
      <GridItemFour>
        <Details community={data.publication} />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <Feed post={data.publication} />
      </GridItemEight>
    </GridLayout>
  )
}

export default ViewCommunity
