import { gql, useQuery } from '@apollo/client'
import UserProfile from '@components/Shared/UserProfile'
import WalletProfile from '@components/Shared/WalletProfile'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import { Follower, PaginatedResultInfo, Profile } from '@generated/types'
import { MinimalProfileFields } from '@gql/MinimalProfileFields'
import { UsersIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import { FC, useState } from 'react'
import { useInView } from 'react-cool-inview'

import SuperFollowed from './SuperFollowed'

const FOLLOWERS_QUERY = gql`
  query Followers($request: FollowersRequest!) {
    followers(request: $request) {
      items {
        wallet {
          address
          defaultProfile {
            ...MinimalProfileFields
          }
        }
        totalAmountOfTimesFollowed
      }
      pageInfo {
        next
        totalCount
      }
    }
  }
  ${MinimalProfileFields}
`

interface Props {
  profile: Profile
}

const Followers: FC<Props> = ({ profile }) => {
  const [followers, setFollowers] = useState<Follower[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const { data, loading, error, fetchMore } = useQuery(FOLLOWERS_QUERY, {
    variables: { request: { profileId: profile?.id, limit: 10 } },
    skip: !profile?.id,
    onCompleted(data) {
      setPageInfo(data?.followers?.pageInfo)
      setFollowers(data?.followers?.items)
      consoleLog(
        'Query',
        '#8b5cf6',
        `Fetched first 10 followers Profile:${profile?.id}`
      )
    }
  })

  const { observe } = useInView({
    threshold: 1,
    onEnter: () => {
      fetchMore({
        variables: {
          request: {
            profileId: profile?.id,
            cursor: pageInfo?.next,
            limit: 10
          }
        }
      }).then(({ data }: any) => {
        setPageInfo(data?.followers?.pageInfo)
        setFollowers([...followers, ...data?.followers?.items])
        consoleLog(
          'Query',
          '#8b5cf6',
          `Fetched next 10 followers Profile:${profile?.id} Next:${pageInfo?.next}`
        )
      })
    }
  })

  if (loading)
    return (
      <div className="p-5 space-y-2 font-bold text-center">
        <Spinner size="md" className="mx-auto" />
        <div>Loading followers</div>
      </div>
    )

  if (data?.followers?.items?.length === 0)
    return (
      <EmptyState
        message={
          <div>
            <span className="mr-1 font-bold">@{profile?.handle}</span>
            <span>doesn’t have any followers yet.</span>
          </div>
        }
        icon={<UsersIcon className="w-8 h-8 text-brand" />}
        hideCard
      />
    )

  return (
    <div className="overflow-y-auto max-h-[80vh]">
      <ErrorMessage
        className="m-5"
        title="Failed to load followers"
        error={error}
      />
      <div className="space-y-3">
        <div className="divide-y dark:divide-gray-700">
          {followers?.map((follower: Follower) => (
            <div
              className="p-5 space-y-3"
              key={follower?.wallet?.defaultProfile?.id}
            >
              {follower?.wallet?.defaultProfile?.followModule && (
                <SuperFollowed times={follower?.totalAmountOfTimesFollowed} />
              )}
              {follower?.wallet?.defaultProfile ? (
                <UserProfile
                  profile={follower?.wallet?.defaultProfile as Profile}
                  showBio
                />
              ) : (
                <WalletProfile wallet={follower?.wallet} />
              )}
            </div>
          ))}
        </div>
        {pageInfo?.next && followers.length !== pageInfo?.totalCount && (
          <span ref={observe} className="flex justify-center p-5">
            <Spinner size="md" />
          </span>
        )}
      </div>
    </div>
  )
}

export default Followers
