import { gql, useQuery } from '@apollo/client'
import UserProfile from '@components/Shared/UserProfile'
import WalletProfile from '@components/Shared/WalletProfile'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import { Follower, Profile } from '@generated/types'
import { UsersIcon } from '@heroicons/react/outline'
import useInView from 'react-cool-inview'

const FOLLOWERS_QUERY = gql`
  query Followers($request: FollowersRequest!) {
    followers(request: $request) {
      items {
        wallet {
          address
          defaultProfile {
            id
            name
            handle
            ownedBy
            picture {
              ... on MediaSet {
                original {
                  url
                }
              }
            }
          }
        }
        totalAmountOfTimesFollowed
      }
      pageInfo {
        next
      }
    }
  }
`

interface Props {
  profile: Profile
}

const Followers: React.FC<Props> = ({ profile }) => {
  const { data, loading, error, fetchMore } = useQuery(FOLLOWERS_QUERY, {
    variables: { request: { profileId: profile?.id, limit: 10 } },
    skip: !profile?.id
  })

  const pageInfo = data?.followers?.pageInfo
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
      <div className="p-5">
        <EmptyState
          message={
            <div>
              <span className="mr-1 font-bold">@{profile.handle}</span>
              <span>doesn’t have any followers yet.</span>
            </div>
          }
          icon={<UsersIcon className="w-8 h-8 text-brand-500" />}
          hideCard
        />
      </div>
    )

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <ErrorMessage
        className="m-5"
        title="Failed to load followers"
        error={error}
      />
      <div className="space-y-3">
        <div className="divide-y">
          {data?.followers?.items?.map((follower: Follower) => (
            <div className="p-5" key={follower?.wallet?.defaultProfile?.id}>
              {follower?.wallet?.defaultProfile ? (
                <UserProfile
                  profile={follower?.wallet?.defaultProfile as Profile}
                />
              ) : (
                <WalletProfile wallet={follower?.wallet} />
              )}
            </div>
          ))}
        </div>
        {pageInfo?.next && (
          <span ref={observe} className="flex justify-center p-5">
            <Spinner size="md" />
          </span>
        )}
      </div>
    </div>
  )
}

export default Followers
