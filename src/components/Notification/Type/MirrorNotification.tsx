import SinglePost from '@components/Post/SinglePost'
import Slug from '@components/Shared/Slug'
import {
  LensterNewMirrorNotification,
  LensterPost
} from '@generated/lenstertypes'
import { DuplicateIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import React from 'react'

interface Props {
  notification: LensterNewMirrorNotification
}

const MirrorNotification: React.FC<Props> = ({ notification }) => {
  return (
    <div>
      <div className="flex items-center px-5 pt-5 space-x-1 text-sm text-gray-500">
        <DuplicateIcon className="w-4 h-4" />
        <div className="flex items-center space-x-1">
          <Link href={`/u/${notification?.profile.handle}`}>
            <a>
              <Slug slug={notification?.profile.handle} prefix="@" />
            </a>
          </Link>
          <div>mirrored your</div>
          <Link href={`/posts/${notification?.publication.pubId}`}>
            <a className="font-bold">
              {notification?.publication.__typename?.toLowerCase()}
            </a>
          </Link>
        </div>
      </div>
      <SinglePost
        post={notification.publication as LensterPost}
        showCard={false}
      />
    </div>
  )
}

export default MirrorNotification
