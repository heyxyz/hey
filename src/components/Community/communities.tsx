import { gql, useQuery } from '@apollo/client'
import { GridLayout } from '@components/GridLayout'
import { PageLoading } from '@components/UI/PageLoading'
import { NextPage } from 'next'
import React from 'react'

export const COMMUNITY_QUERY = gql`
  query ($request: ExplorePublicationRequest!) {
    explorePublications(request: $request) {
      items {
        ... on Post {
          id
        }
      }
    }
  }
`

const Communities: NextPage = () => {
  const { data, loading } = useQuery(COMMUNITY_QUERY, {
    variables: {
      request: {
        sources: 'Lenster',
        sortCriteria: 'TOP_COMMENTED'
      }
    }
  })

  if (loading || !data) return <PageLoading message="Loading community" />

  return <GridLayout className="pt-6">WIP</GridLayout>
}

export default Communities
