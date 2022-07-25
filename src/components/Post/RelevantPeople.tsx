import { gql, useQuery } from '@apollo/client'
import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer'
import UserProfile from '@components/Shared/UserProfile'
import { Card, CardBody } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { LensterPost } from '@generated/lenstertypes'
import { Profile } from '@generated/types'
import { MinimalProfileFields } from '@gql/MinimalProfileFields'
import Logger from '@lib/logger'
import React, { FC } from 'react'

const RELEVANT_PEOPLE_QUERY = gql`
  query RelevantPeople($request: ProfileQueryRequest!) {
    profiles(request: $request) {
      items {
        ...MinimalProfileFields
        isFollowedByMe
      }
    }
  }
  ${MinimalProfileFields}
`

interface Props {
  publication: LensterPost
}

const RelevantPeople: FC<Props> = ({ publication }) => {
  const mentions = publication?.metadata?.content?.match(
    /([\s+])@([^\s]+)/g,
    '$1[~$2]'
  )

  const processedMentions = mentions
    ? mentions.map((mention: string) => {
        return mention.trim().replace('@', '').replace("'s", '')
      })
    : []

  processedMentions?.push(publication?.profile?.handle)

  const { data, loading, error } = useQuery(RELEVANT_PEOPLE_QUERY, {
    variables: { request: { handles: processedMentions.slice(0, 5) } },
    skip: processedMentions.length === 1,
    onCompleted(data) {
      Logger.log(
        '[Query]',
        `Fetched ${data?.recommendedProfiles?.length} relevant people`
      )
    }
  })

  if (loading)
    return (
      <Card>
        <CardBody className="space-y-4">
          <UserProfileShimmer showFollow />
          <UserProfileShimmer showFollow />
          <UserProfileShimmer showFollow />
          <UserProfileShimmer showFollow />
          <UserProfileShimmer showFollow />
        </CardBody>
      </Card>
    )

  if (processedMentions.length === 1) return null

  return (
    <Card testId="relevant-people">
      <CardBody className="space-y-4">
        <ErrorMessage title="Failed to load relevant people" error={error} />
        {data?.profiles?.items?.map((profile: Profile) => (
          <div key={profile?.id} className="truncate">
            <UserProfile
              profile={profile}
              isFollowing={profile.isFollowedByMe}
              showFollow
            />
          </div>
        ))}
      </CardBody>
    </Card>
  )
}

export default RelevantPeople
