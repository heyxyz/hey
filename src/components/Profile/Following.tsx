import { gql, useQuery } from '@apollo/client'
import UserProfile from '@components/Shared/UserProfile'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import { Following, PaginatedResultInfo, Profile } from '@generated/types'
import { UsersIcon } from '@heroicons/react/outline'
import { useState } from 'react'
import { useInView } from 'react-cool-inview'

const FOLLOWING_QUERY = gql`
  query Following($request: FollowingRequest!) {
    following(request: $request) {
      items {
        profile {
          id
          name
          handle
          bio
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
      pageInfo {
        next
        totalCount
      }
    }
  }
`

interface Props {
  profile: Profile
}

const Following: React.FC<Props> = ({ profile }) => {
  const [following, setFollowing] = useState<Following[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const { data, loading, error, fetchMore } = useQuery(FOLLOWING_QUERY, {
    variables: { request: { address: profile?.ownedBy, limit: 10 } },
    skip: !profile?.id,
    onCompleted(data) {
      setPageInfo(data?.following?.pageInfo)
      setFollowing(data?.following?.items)
    }
  })

  const { observe } = useInView({
    threshold: 1,
    onEnter: () => {
      fetchMore({
        variables: {
          request: {
            address: profile?.ownedBy,
            cursor: pageInfo?.next,
            limit: 10
          }
        }
      }).then(({ data }: any) => {
        setPageInfo(data?.following?.pageInfo)
        setFollowing([...following, ...data?.following?.items])
      })
    }
  })

  if (loading)
    return (
      <div className="p-5 space-y-2 font-bold text-center">
        <Spinner size="md" className="mx-auto" />
        <div>Loading following</div>
      </div>
    )

  if (data?.following?.items?.length === 0)
    return (
      <div className="p-5">
        <EmptyState
          message={
            <div>
              <span className="mr-1 font-bold">@{profile.handle}</span>
              <span>doesn’t follow anyone.</span>
            </div>
          }
          icon={<UsersIcon className="w-8 h-8 text-brand-500" />}
          hideCard
        />
      </div>
    )

  return (
    <div className="overflow-y-auto max-h-[80vh]">
      <ErrorMessage
        className="m-5"
        title="Failed to load following"
        error={error}
      />
      <div className="space-y-3">
        <div className="divide-y">
          {following?.map((following: Following) => (
            <div className="p-5" key={following?.profile.id}>
              <UserProfile profile={following?.profile} showBio />
            </div>
          ))}
        </div>
        {pageInfo?.next && following.length !== pageInfo?.totalCount && (
          <span ref={observe} className="flex justify-center p-5">
            <Spinner size="md" />
          </span>
        )}
      </div>
    </div>
  )
}

export default Following
