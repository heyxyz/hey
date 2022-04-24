import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import PostsShimmer from '@components/Shared/Shimmer/PostsShimmer'
import { Card, CardBody } from '@components/UI/Card'
import React, { FC, useEffect, useState } from 'react'


const APIURL = 'https://api.thegraph.com/subgraphs/name/franz101/lens-protocol'
const EXPLORE_POSTS_QUERY = gql`
  query {
    profiles(first: 20, orderBy: pubCount, orderDirection: desc) {
   profiles(first: 10, orderBy: pubCount) {
 features/thegraph
      id
      pubCount
      owner
      imageURI
      handle
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
  }, [])

  return (
    <>
      {!data && <PostsShimmer />}
      <h1>Power Users</h1>
      <h2>Our most active community members</h2>
      {(data || []).map((profile: any) => {
        return (
          <Card key="profile">
            <CardBody>
              <h3 key="itemHandler">{profile.handle}</h3>

              <div className="flex justify-between items-center">
                <a href={`/u/${profile?.handle}`}>
                  <div className="flex items-center space-x-3">
                    <img
                      height={100}
                      width={100}
                      src={profile?.imageURI}
                      // className={clsx(
                      //   isBig ? 'w-14 h-14' : 'w-10 h-10',
                      //   'bg-gray-200 rounded-full border dark:border-gray-700/80'
                      // )}
                      alt={profile?.handle}
                    />
                  </div>
                </a>
              </div>
              {/* <Attachments
                attachments={
                  'https://ik.imagekit.io/lensterdev/tr:n-avatar/https://ipfs.infura.io/ipfs/QmaNPt96Y3NYwHDsrPD2Lv2Y9cySqpTRHpc4rsHwzei9bJ'
                }
              /> */}
              {/* <div className="flex justify-between pb-4">
                <UserProfile
                  profile={
                    post?.__typename === 'Mirror'
                      ? post?.mirrorOf?.profile
                      : post?.profile
                  }
                />
                <Link href={`/posts/${post?.id}`}>
                  <a
                    href={`/posts/${post?.id}`}
                    className="text-sm text-gray-500"
                  >
                    {dayjs(new Date(post?.createdAt)).fromNow()}
                  </a>
                </Link>
              </div>
              <PostBody post={post} />
              {post?.metadata?.media?.length > 0 ? (
                <Attachments attachments={post?.metadata?.media} />
              ) : (
                post?.metadata?.content &&
                postType !== 'crowdfund' &&
                postType !== 'community' &&
                !!getURLFromPublication(post?.metadata?.content) && (
                  <IFramely
                    url={getURLFromPublication(post?.metadata?.content)}
                  />
                )
              )} */}
            </CardBody>
            {/* <PostActions post={post} /> */}
          </Card>
        )
      })}
      {/* {JSON.stringify(data)} */}
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
