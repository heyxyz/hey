import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import PostsShimmer from '@components/Shared/Shimmer/PostsShimmer'
import React, { FC, useEffect, useState } from 'react'
/*
  query MyQuery {
  posts(first: 10, orderBy: timestamp, orderDirection: desc) {
    id
    profileId {
      id
      creator
    }
  }
}
*/
const APIURL = 'https://api.thegraph.com/subgraphs/name/anudit/lens-protocol'

const EXPLORE_PROFILES_QUERY = gql`
  query {
    profiles(first: 10, orderBy: pubCount) {
      id
      pubCount
    }
  }
`

interface Props {
  feedType?: string
}

const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache()
})

const Dashboard: FC<Props> = ({ feedType = 'TOP_USERS' }) => {
  const [data, setData] = useState<any>(null)

  const [query, setQuery] = useState<string>('EXPLORE_PROFILES_QUERY')

  useEffect(() => {
    const fetchData = async () => {
      const data = await client.query({
        query: EXPLORE_PROFILES_QUERY
      })
      setData(data.data.profiles)
    }

    fetchData()
  }, [query])

  return (
    <>
      <h3 onClick={() => setQuery('EXPLORE_PROFILES_QUERY')}>Profiles</h3>
      <h3 onClick={() => setQuery('EXPLORE_POSTS_QUERY')}>Posts</h3>

      {!data && <PostsShimmer />}
      {JSON.stringify(data)}
      {/* {data?.explorePublications?.items?.length === 0 && (
        <EmptyState
          message={<div>No posts yet!</div>}
          icon={<CollectionIcon className="w-8 h-8 text-brand" />}
        />
      )}
      <ErrorMessage title="Failed to load explore feed" error={error} />
      {!error && !loading && (
        <>
          <div className="space-y-3">
            {publications?.map((post: LensterPost, index: number) => (
              <SinglePost key={`${post?.id}_${index}`} post={post} />
            ))}
          </div>
          {pageInfo?.next && (
            <span ref={observe} className="flex justify-center p-5">
              <Spinner size="sm" />
            </span>
          )}
        </>
      )} */}
    </>
  )
}

export default Dashboard
