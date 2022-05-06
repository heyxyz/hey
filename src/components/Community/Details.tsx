import { gql, useQuery } from '@apollo/client'
import Collectors from '@components/Shared/Collectors'
import { Button } from '@components/UI/Button'
import { Modal } from '@components/UI/Modal'
import AppContext from '@components/utils/AppContext'
import { HashtagMatcher } from '@components/utils/matchers/HashtagMatcher'
import { MDBoldMatcher } from '@components/utils/matchers/markdown/MDBoldMatcher'
import { MDItalicMatcher } from '@components/utils/matchers/markdown/MDItalicMatcher'
import { MentionMatcher } from '@components/utils/matchers/MentionMatcher'
import { LensterPost } from '@generated/lenstertypes'
import {
  ClockIcon,
  CogIcon,
  HashtagIcon,
  PencilAltIcon,
  UsersIcon
} from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import humanize from '@lib/humanize'
import imagekitURL from '@lib/imagekitURL'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Interweave } from 'interweave'
import { UrlMatcher } from 'interweave-autolink'
import dynamic from 'next/dynamic'
import React, { FC, ReactChild, useContext, useState } from 'react'

import Join from './Join'

const Settings = dynamic(() => import('./Settings'), {
  loading: () => <div className="m-5 h-5 rounded-lg shimmer" />
})

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

const Details: FC<Props> = ({ community }) => {
  const { currentUser } = useContext(AppContext)
  const [showMembersModal, setShowMembersModal] = useState<boolean>(false)
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false)
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
        'Query',
        '#8b5cf6',
        `Fetched has joined check Community:${community?.id} Joined:${joined}`
      )
    }
  })

  const MetaDetails = ({
    children,
    icon
  }: {
    children: ReactChild
    icon: ReactChild
  }) => (
    <div className="flex gap-2 items-center">
      {icon}
      {children}
    </div>
  )

  return (
    <div className="px-5 mb-4 space-y-5 sm:px-0">
      <div className="relative w-32 h-32 sm:w-72 sm:h-72">
        <img
          src={imagekitURL(
            community?.metadata?.cover?.original?.url
              ? community?.metadata?.cover?.original?.url
              : `https://avatar.tobi.sh/${community?.id}.png`,
            'avatar'
          )}
          className="w-32 h-32 bg-gray-200 rounded-xl ring-8 ring-gray-50 sm:w-72 sm:h-72 dark:bg-gray-700 dark:ring-black"
          alt={community?.id}
        />
      </div>
      <div className="pt-1 text-2xl font-bold">
        <div className="truncate">{community?.metadata?.name}</div>
      </div>
      <div className="space-y-5">
        {community?.metadata?.description && (
          <div className="mr-0 leading-7 sm:mr-10 linkify">
            <Interweave
              content={community?.metadata?.description}
              matchers={[
                new UrlMatcher('url'),
                new HashtagMatcher('hashtag'),
                new MentionMatcher('mention'),
                new MDBoldMatcher('mdBold'),
                new MDItalicMatcher('mdItalic')
              ]}
            />
          </div>
        )}
        <div className="flex items-center space-x-2">
          {joinLoading ? (
            <div className="w-28 rounded-lg h-[34px] shimmer" />
          ) : joined ? (
            <div className="py-0.5 px-2 text-sm text-white rounded-lg shadow-sm bg-brand-500 w-fit">
              Member
            </div>
          ) : (
            <Join community={community} setJoined={setJoined} />
          )}
          {currentUser?.id === community?.profile?.id && (
            <>
              <Button
                variant="secondary"
                className="!py-1.5"
                icon={<PencilAltIcon className="w-5 h-5" />}
                onClick={() => setShowSettingsModal(!showSettingsModal)}
              />
              <Modal
                title="Settings"
                icon={<CogIcon className="w-5 h-5 text-brand" />}
                show={showSettingsModal}
                onClose={() => setShowSettingsModal(!showSettingsModal)}
              >
                <Settings community={community} />
              </Modal>
            </>
          )}
        </div>
        <div className="space-y-2">
          <MetaDetails icon={<HashtagIcon className="w-4 h-4" />}>
            {community?.id}
          </MetaDetails>
          <MetaDetails icon={<UsersIcon className="w-4 h-4" />}>
            <>
              <button
                type="button"
                onClick={() => setShowMembersModal(!showMembersModal)}
              >
                {humanize(community?.stats?.totalAmountOfCollects)}{' '}
                {community?.stats?.totalAmountOfCollects > 1
                  ? 'members'
                  : 'member'}
              </button>
              <Modal
                title="Members"
                icon={<UsersIcon className="w-5 h-5 text-brand" />}
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
