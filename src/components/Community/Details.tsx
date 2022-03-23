import 'linkify-plugin-mention'

import { gql, useQuery } from '@apollo/client'
import AppContext from '@components/utils/AppContext'
import { LensterPost } from '@generated/lenstertypes'
import { ClockIcon, HashtagIcon, UsersIcon } from '@heroicons/react/outline'
import { humanize } from '@lib/humanize'
import { linkifyOptions } from '@lib/linkifyOptions'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Linkify from 'linkify-react'
import React, { useContext, useState } from 'react'

import Join from './Join'

dayjs.extend(relativeTime)

export const HAS_JOINED_QUERY = gql`
  query DoesFollow($request: HasCollectedRequest!) {
    hasCollected(request: $request) {
      results {
        collected
      }
    }
  }
`

interface Props {
  community: LensterPost
}

const Details: React.FC<Props> = ({ community }) => {
  const { currentUser } = useContext(AppContext)
  const [joined, setJoined] = useState<boolean>(false)
  const { loading: joinLoading } = useQuery(HAS_JOINED_QUERY, {
    variables: {
      request: {
        collectRequests: {
          publicationIds: community.pubId,
          walletAddress: currentUser?.ownedBy
        }
      }
    },
    skip: !currentUser || !community,
    onCompleted(data) {
      setJoined(data?.hasCollected[0]?.results[0]?.collected)
    }
  })

  const MetaDetails = ({
    children,
    icon
  }: {
    children: React.ReactChild
    icon: React.ReactChild
  }) => (
    <div className="flex items-center gap-2">
      {icon}
      <div>{children}</div>
    </div>
  )

  return (
    <div className="px-5 mb-4 sm:px-0">
      <div className="space-y-5">
        <div className="relative w-32 h-32 sm:h-72 sm:w-72">
          <img
            src={
              community?.metadata?.cover?.original?.url
                ? community?.metadata?.cover?.original?.url
                : `https://avatar.tobi.sh/${community?.pubId}.png`
            }
            className="w-32 h-32 bg-gray-200 rounded-xl ring-8 sm:h-72 sm:w-72 dark:bg-gray-700 ring-gray-50 dark:ring-black"
            alt={community?.pubId}
          />
        </div>
        <div className="pt-3 space-y-1">
          <div className="flex items-center gap-1.5 text-2xl font-bold truncate">
            <div className="truncate">{community?.metadata.name}</div>
          </div>
        </div>
        <div className="space-y-5">
          {community?.metadata.description && (
            <div className="mr-0 leading-7 sm:mr-10 linkify">
              <Linkify tagName="div" options={linkifyOptions}>
                {community?.metadata.description}
              </Linkify>
            </div>
          )}
          {joinLoading ? (
            <div className="h-[34px] rounded-lg w-28 shimmer" />
          ) : joined ? (
            <div className="px-2 rounded-lg shadow-sm py-0.5 text-sm text-white bg-brand-500 w-fit">
              Member
            </div>
          ) : (
            <Join community={community} setJoined={setJoined} />
          )}
          <div className="space-y-2">
            <MetaDetails icon={<HashtagIcon className="w-4 h-4" />}>
              {community?.pubId}
            </MetaDetails>
            <MetaDetails icon={<UsersIcon className="w-4 h-4" />}>
              <div>
                {humanize(community?.stats?.totalAmountOfCollects)}{' '}
                {community?.stats?.totalAmountOfCollects > 1
                  ? 'members'
                  : 'member'}
              </div>
            </MetaDetails>
            <MetaDetails icon={<UsersIcon className="w-4 h-4" />}>
              <div>
                {humanize(community?.stats?.totalAmountOfComments)}{' '}
                {community?.stats?.totalAmountOfComments > 1 ? 'posts' : 'post'}
              </div>
            </MetaDetails>
            <MetaDetails icon={<ClockIcon className="w-4 h-4" />}>
              {dayjs(new Date(community?.createdAt)).fromNow()}
            </MetaDetails>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Details
