import { gql, useQuery } from '@apollo/client'
import PostsShimmer from '@components/Shared/Shimmer/PostsShimmer'
import UserProfile from '@components/Shared/UserProfile'
import { Card, CardBody } from '@components/UI/Card'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import { PaginatedResultInfo, Profile } from '@generated/types'
import { MinimalProfileFields } from '@gql/MinimalProfileFields'
import { CollectionIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import React, { FC, useState } from 'react'
import { useInView } from 'react-cool-inview'

const SEARCH_PROFILES_QUERY = gql`
  query SearchProfiles($request: SearchQueryRequest!) {
    search(request: $request) {
      ... on ProfileSearchResult {
        items {
          ...MinimalProfileFields
        }
        pageInfo {
          next
        }
      }
    }
  }
  ${MinimalProfileFields}
`

interface Props {
  query: any
}

const Profiles: FC<Props> = ({ query }) => {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const { data, loading, error, fetchMore } = useQuery(SEARCH_PROFILES_QUERY, {
    variables: { request: { query, type: 'PROFILE' } },
    skip: !query,
    onCompleted(data) {
      setPageInfo(data?.search?.pageInfo)
      setProfiles(data?.search?.items)
      consoleLog(
        'Query',
        '#8b5cf6',
        `Fetched first 10 profiles for search Keyword:${query}`
      )
    }
  })

  const { observe } = useInView({
    threshold: 1,
    onEnter: () => {
      fetchMore({
        variables: {
          request: { query, type: 'PROFILE' }
        }
      }).then(({ data }: any) => {
        setPageInfo(data?.search?.pageInfo)
        setProfiles([...profiles, ...data?.search?.items])
        consoleLog(
          'Query',
          '#8b5cf6',
          `Fetched next 10 profiles for search Keyword:${query} Next:${pageInfo?.next}`
        )
      })
    }
  })

  return (
    <>
      {loading && <PostsShimmer />}
      {data?.search?.items?.length === 0 && (
        <EmptyState
          message={<div>No profiles found!</div>}
          icon={<CollectionIcon className="w-8 h-8 text-brand-500" />}
        />
      )}
      <ErrorMessage title="Failed to load explore feed" error={error} />
      {!error && !loading && (
        <>
          <div className="space-y-3">
            {profiles?.map((profile: Profile) => (
              <Card key={profile?.id}>
                <CardBody>
                  <UserProfile profile={profile} showBio />
                </CardBody>
              </Card>
            ))}
          </div>
          {pageInfo?.next && (
            <span ref={observe} className="flex justify-center p-5">
              <Spinner size="sm" />
            </span>
          )}
        </>
      )}
    </>
  )
}

export default Profiles
