import { gql, useQuery } from '@apollo/client'
import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer'
import UserProfile from '@components/Shared/UserProfile'
import { Card, CardBody } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { LensterPublication } from '@generated/lenstertypes'
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
  publication: LensterPublication
}

const RelevantPeople: FC<Props> = ({ publication }) => {
  const mentions =
    publication?.metadata?.content?.match(/([\s+])@([^\s]+)/g, '$1[~$2]') ?? []

  mentions.push(publication?.profile?.handle)

  const processedMentions = mentions
    ? mentions.map((mention: string) => {
        const trimmedMention = mention.trim().replace('@', '').replace("'s", '')

        if (trimmedMention.length > 9) {
          return mention.trim().replace('@', '').replace("'s", '')
        } else {
          return publication?.profile?.handle
        }
      })
    : []

  const cleanedMentions = [...new Set(processedMentions)]

  const { data, loading, error } = useQuery(RELEVANT_PEOPLE_QUERY, {
    variables: { request: { handles: cleanedMentions.slice(0, 5) } },
    onCompleted(data) {
      Logger.log(
        '[Query]',
        `Fetched ${data?.cleanedMentions?.length} relevant people`
      )
    },
    onError(error) {
      Logger.error('[Query Error]', error)
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

  if (data?.profiles?.items?.length === 0) return null

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
