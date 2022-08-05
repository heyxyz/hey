import { gql, useQuery } from '@apollo/client'
import Loader from '@components/Shared/Loader'
import UserProfile from '@components/Shared/UserProfile'
import WalletProfile from '@components/Shared/WalletProfile'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import { Follower, PaginatedResultInfo, Profile } from '@generated/types'
import { MinimalProfileFields } from '@gql/MinimalProfileFields'
import { UsersIcon } from '@heroicons/react/outline'
import { Dogstats } from '@lib/dogstats'
import { FC, useState } from 'react'
import { useInView } from 'react-cool-inview'
import { PAGINATION } from 'src/tracking'

const FOLLOWERS_QUERY = gql`
  query Followers($request: FollowersRequest!) {
    followers(request: $request) {
      items {
        wallet {
          address
          defaultProfile {
            ...MinimalProfileFields
            isFollowedByMe
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
    }
  })

  const { observe } = useInView({
    onEnter: async () => {
      const { data } = await fetchMore({
        variables: {
          request: {
            profileId: profile?.id,
            cursor: pageInfo?.next,
            limit: 10
          }
        }
      })
      setPageInfo(data?.followers?.pageInfo)
      setFollowers([...followers, ...data?.followers?.items])
      Dogstats.track(PAGINATION.FOLLOWERS, { pageInfo })
    }
  })

  if (loading) return <Loader message="Loading followers" />

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
            <div className="p-5" key={follower?.wallet?.defaultProfile?.id}>
              {follower?.wallet?.defaultProfile ? (
                <UserProfile
                  profile={follower?.wallet?.defaultProfile}
                  showBio
                  showFollow
                  isFollowing={follower?.wallet?.defaultProfile?.isFollowedByMe}
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
