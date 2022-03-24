import { gql, useQuery } from '@apollo/client'
import { GridItemSix, GridLayout } from '@components/GridLayout'
import { PageLoading } from '@components/UI/PageLoading'
import { CommunityFragment } from '@gql/CommunityFragment'
import { NextPage } from 'next'
import React from 'react'

import List from './List'

const COMMUNITY_QUERY = gql`
  query (
    $topCommented: ExplorePublicationRequest!
    $topCollected: ExplorePublicationRequest!
  ) {
    topCommented: explorePublications(request: $topCommented) {
      items {
        ... on Post {
          ...CommunityFragment
        }
      }
    }
    topCollected: explorePublications(request: $topCollected) {
      items {
        ... on Post {
          ...CommunityFragment
        }
      }
    }
  }
  ${CommunityFragment}
`

const Communities: NextPage = () => {
  const { data, loading } = useQuery(COMMUNITY_QUERY, {
    variables: {
      topCommented: {
        sources: 'Lenster Community',
        sortCriteria: 'TOP_COMMENTED'
      },
      topCollected: {
        sources: 'Lenster Community',
        sortCriteria: 'TOP_COLLECTED'
      }
    }
  })

  if (loading || !data) return <PageLoading message="Loading community" />

  return (
    <GridLayout className="pt-6">
      <GridItemSix>
        <List communities={data?.topCommented.items} />
      </GridItemSix>
      <GridItemSix>
        <List communities={data?.topCollected.items} />
      </GridItemSix>
    </GridLayout>
  )
}

export default Communities
