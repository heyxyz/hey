import { gql, useQuery } from '@apollo/client'
import { GridLayout } from '@components/GridLayout'
import { PageLoading } from '@components/UI/PageLoading'
import { NextPage } from 'next'
import React from 'react'

export const COMMUNITY_QUERY = gql`
  query (
    $topCommented: ExplorePublicationRequest!
    $topCollected: ExplorePublicationRequest!
  ) {
    topCommented: explorePublications(request: $topCommented) {
      items {
        ... on Post {
          id
          metadata {
            name
          }
        }
      }
    }
    topCollected: explorePublications(request: $topCollected) {
      items {
        ... on Post {
          id
          metadata {
            name
          }
        }
      }
    }
  }
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

  return <GridLayout className="pt-6">WIP</GridLayout>
}

export default Communities
