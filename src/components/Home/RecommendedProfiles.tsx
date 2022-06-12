import { gql, useQuery } from '@apollo/client'
import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer'
import UserProfile from '@components/Shared/UserProfile'
import { Card, CardBody } from '@components/UI/Card'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import AppContext from '@components/utils/AppContext'
import { DoesFollowResponse, Profile } from '@generated/types'
import { MinimalProfileFields } from '@gql/MinimalProfileFields'
import { UsersIcon } from '@heroicons/react/outline'
import { LightningBoltIcon, SparklesIcon } from '@heroicons/react/solid'
import consoleLog from '@lib/consoleLog'
import randomizeArray from '@lib/randomizeArray'
import React, { FC, useContext } from 'react'
import { ZERO_ADDRESS } from 'src/constants'

const RECOMMENDED_PROFILES_QUERY = gql`
  query RecommendedProfiles {
    recommendedProfiles {
      ...MinimalProfileFields
    }
  }
  ${MinimalProfileFields}
`

const DOES_FOLLOW_QUERY = gql`
  query DoesFollow($request: DoesFollowRequest!) {
    doesFollow(request: $request) {
      profileId
      follows
    }
  }
`

const Title = () => {
  const { currentUser } = useContext(AppContext)

  return (
    <div className="flex gap-2 items-center px-5 mb-2 sm:px-0">
      {currentUser ? (
        <>
          <SparklesIcon className="w-4 h-4 text-yellow-500" />
          <div>Who to follow</div>
        </>
      ) : (
        <>
          <LightningBoltIcon className="w-4 h-4 text-yellow-500" />
          <div>Recommended users</div>
        </>
      )}
    </div>
  )
}

const RecommendedProfiles: FC = () => {
  const { currentUser } = useContext(AppContext)

  const { data, loading, error } = useQuery(RECOMMENDED_PROFILES_QUERY, {
    onCompleted(data) {
      consoleLog(
        'Query',
        '#8b5cf6',
        `Fetched ${data?.recommendedProfiles?.length} recommended profiles`
      )
    }
  })

  console.log(data?.recommendedProfiles)

  const { data: followData, loading: followLoading } = useQuery(
    DOES_FOLLOW_QUERY,
    {
      variables: {
        request: {
          followInfos: data?.recommendedProfiles?.map((profile: Profile) => {
            return {
              followerAddress: currentUser?.ownedBy ?? ZERO_ADDRESS,
              profileId: profile?.id
            }
          })
        }
      },
      skip: !data?.recommendedProfiles,
      onCompleted() {
        consoleLog(
          'Query',
          '#8b5cf6',
          `Fetched ${data?.recommendedProfiles?.length} user's follow status`
        )
      }
    }
  )

  console.log(followData)

  if (loading || followLoading)
    return (
      <>
        <Title />
        <Card>
          <CardBody className="space-y-4">
            <UserProfileShimmer showFollow />
            <UserProfileShimmer showFollow />
            <UserProfileShimmer showFollow />
            <UserProfileShimmer showFollow />
            <UserProfileShimmer showFollow />
          </CardBody>
        </Card>
      </>
    )

  if (data?.recommendedProfiles?.length === 0)
    return (
      <>
        <Title />
        <EmptyState
          message={
            <div>
              <span>No recommendations!</span>
            </div>
          }
          icon={<UsersIcon className="w-8 h-8 text-brand" />}
        />
      </>
    )

  return (
    <>
      <Title />
      <Card>
        <CardBody className="space-y-4">
          <ErrorMessage title="Failed to recommendations" error={error} />
          {randomizeArray(data?.recommendedProfiles)
            ?.slice(0, 5)
            ?.map((profile: Profile) => (
              <div key={profile?.id} className="truncate">
                <UserProfile
                  profile={profile}
                  isFollowing={
                    followData?.doesFollow?.find(
                      (follow: DoesFollowResponse) =>
                        follow.profileId === profile.id
                    ).follows
                  }
                  showFollow
                />
              </div>
            ))}
        </CardBody>
      </Card>
    </>
  )
}

export default RecommendedProfiles
