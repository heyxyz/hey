import Collectors from '@components/Shared/Collectors'
import Markup from '@components/Shared/Markup'
import { Button } from '@components/UI/Button'
import { Modal } from '@components/UI/Modal'
import { LensterPublication } from '@generated/lenstertypes'
import {
  ClockIcon,
  CogIcon,
  HashtagIcon,
  PencilAltIcon,
  UsersIcon
} from '@heroicons/react/outline'
import { Dogstats } from '@lib/dogstats'
import imagekitURL from '@lib/imagekitURL'
import nFormatter from '@lib/nFormatter'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import dynamic from 'next/dynamic'
import React, { FC, ReactNode, useState } from 'react'
import { useAppPersistStore } from 'src/store/app'
import { COMMUNITY } from 'src/tracking'

import Join from './Join'

const Settings = dynamic(() => import('./Settings'), {
  loading: () => <div className="m-5 h-5 rounded-lg shimmer" />
})

dayjs.extend(relativeTime)

interface Props {
  community: LensterPublication
}

const Details: FC<Props> = ({ community }) => {
  const { currentUser } = useAppPersistStore()
  const [showMembersModal, setShowMembersModal] = useState<boolean>(false)
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false)
  const [joined, setJoined] = useState<boolean>(community?.hasCollectedByMe)

  const MetaDetails = ({
    children,
    icon
  }: {
    children: ReactNode
    icon: ReactNode
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
          className="w-32 h-32 bg-gray-200 rounded-xl ring-2 ring-gray-200 sm:w-72 sm:h-72 dark:bg-gray-700 dark:ring-gray-700/80"
          height={128}
          width={128}
          alt={community?.id}
        />
      </div>
      <div className="pt-1 text-2xl font-bold">
        <div className="truncate">{community?.metadata?.name}</div>
      </div>
      <div className="space-y-5">
        {community?.metadata?.description && (
          <div className="mr-0 leading-7 sm:mr-10 linkify">
            <Markup>{community?.metadata?.description}</Markup>
          </div>
        )}
        <div className="flex items-center space-x-2">
          {joined ? (
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
                onClick={() => {
                  setShowSettingsModal(!showSettingsModal)
                  Dogstats.track(COMMUNITY.SETTINGS.DELETE)
                }}
              />
              <Modal
                title="Settings"
                icon={<CogIcon className="w-5 h-5 text-brand" />}
                show={showSettingsModal}
                onClose={() => setShowSettingsModal(false)}
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
                onClick={() => {
                  Dogstats.track(COMMUNITY.OPEN_MEMBERS)
                  setShowMembersModal(!showMembersModal)
                }}
              >
                {nFormatter(community?.stats?.totalAmountOfCollects)}{' '}
                {community?.stats?.totalAmountOfCollects === 1
                  ? 'member'
                  : 'members'}
              </button>
              <Modal
                title="Members"
                icon={<UsersIcon className="w-5 h-5 text-brand" />}
                show={showMembersModal}
                onClose={() => setShowMembersModal(false)}
              >
                <Collectors pubId={community.id} />
              </Modal>
            </>
          </MetaDetails>
          <MetaDetails icon={<UsersIcon className="w-4 h-4" />}>
            <>
              {nFormatter(community?.stats?.totalAmountOfComments)}{' '}
              {community?.stats?.totalAmountOfComments === 1 ? 'post' : 'posts'}
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
