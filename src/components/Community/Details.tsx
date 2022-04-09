import 'linkify-plugin-mention'

import { gql, useQuery } from '@apollo/client'
import Collectors from '@components/Shared/Collectors'
import { Modal } from '@components/UI/Modal'
import AppContext from '@components/utils/AppContext'
import { LensterPost } from '@generated/lenstertypes'
import { ClockIcon, HashtagIcon, UsersIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import humanize from '@lib/humanize'
import imagekitURL from '@lib/imagekitURL'
import linkifyOptions from '@lib/linkifyOptions'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Linkify from 'linkify-react'
import React, { useContext, useState } from 'react'

import Join from './Join'

dayjs.extend(relativeTime)

export const HAS_JOINED_QUERY = gql`
  query HasJoined($request: HasCollectedRequest!) {
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
  const [showMembersModal, setShowMembersModal] = useState<boolean>(false)
  const [joined, setJoined] = useState<boolean>(false)
  const { loading: joinLoading } = useQuery(HAS_JOINED_QUERY, {
    variables: {
      request: {
        collectRequests: {
          publicationIds: community.id,
          walletAddress: currentUser?.ownedBy
        }
      }
    },
    skip: !currentUser || !community,
    onCompleted(data) {
      setJoined(data?.hasCollected[0]?.results[0]?.collected)
      consoleLog(
        'Fetch',
        '#8b5cf6',
        `Fetched has joined check Community:${community?.id} Joined:${joined}`
      )
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
      {children}
    </div>
  )

  return (
    <div className="px-5 mb-4 sm:px-0 space-y-5">
      <div className="relative w-32 h-32 sm:w-72 sm:h-72">
        <img
          src={imagekitURL(
            community?.metadata?.cover?.original?.url
              ? community?.metadata?.cover?.original?.url
              : `https://avatar.tobi.sh/${community?.id}.png`,
            500,
            500
          )}
          className="w-32 h-32 bg-gray-200 rounded-xl ring-8 ring-gray-50 sm:w-72 sm:h-72 dark:bg-gray-700 dark:ring-black"
          alt={community?.id}
        />
      </div>
      <div className="text-2xl font-bold pt-1">
        <div className="truncate">{community?.metadata.name}</div>
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
          <div className="w-28 rounded-lg h-[34px] shimmer" />
        ) : joined ? (
          <div className="py-0.5 px-2 text-sm text-white rounded-lg shadow-sm bg-brand-500 w-fit">
            Member
          </div>
        ) : (
          <Join community={community} setJoined={setJoined} />
        )}
        <div className="space-y-2">
          <MetaDetails icon={<HashtagIcon className="w-4 h-4" />}>
            {community?.id}
          </MetaDetails>
          <MetaDetails icon={<UsersIcon className="w-4 h-4" />}>
            <>
              <button onClick={() => setShowMembersModal(!showMembersModal)}>
                {humanize(community?.stats?.totalAmountOfCollects)}{' '}
                {community?.stats?.totalAmountOfCollects > 1
                  ? 'members'
                  : 'member'}
              </button>
              <Modal
                title="Members"
                icon={<UsersIcon className="w-5 h-5 text-brand-500" />}
                show={showMembersModal}
                onClose={() => setShowMembersModal(!showMembersModal)}
              >
                <Collectors pubId={community.id} />
              </Modal>
            </>
          </MetaDetails>
          <MetaDetails icon={<UsersIcon className="w-4 h-4" />}>
            <>
              {humanize(community?.stats?.totalAmountOfComments)}{' '}
              {community?.stats?.totalAmountOfComments > 1 ? 'posts' : 'post'}
            </>
          </MetaDetails>
          <MetaDetails icon={<ClockIcon className="w-4 h-4" />}>
            {dayjs(new Date(community?.createdAt)).fromNow()}
          </MetaDetails>
        </div>
      </div>
    </div>
  )
}

export default Details
