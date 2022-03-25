import SinglePost from '@components/Post/SinglePost'
import Slug from '@components/Shared/Slug'
import {
  LensterNewCommentNotification,
  LensterPost
} from '@generated/lenstertypes'
import { NewCommentNotification } from '@generated/types'
import { ChatAlt2Icon } from '@heroicons/react/outline'
import Link from 'next/link'
import React from 'react'

interface Props {
  notification: LensterNewCommentNotification
}

const NewCommentNotification: React.FC<Props> = ({ notification }) => {
  return (
    <div>
      <div className="flex items-center px-5 pt-5 space-x-1 text-sm text-gray-500">
        <ChatAlt2Icon className="w-4 h-4" />
        <div className="flex items-center space-x-1">
          <Link href={`/u/${notification?.profile.handle}`}>
            <a>
              <Slug slug={notification?.profile.handle} prefix="@" />
            </a>
          </Link>
          <div>commented on your</div>
          <Link href={`/posts/${notification?.comment.pubId}`}>
            <a className="font-bold">
              {notification?.comment?.commentOn?.__typename?.toLowerCase()}
            </a>
          </Link>
        </div>
      </div>
      <SinglePost
        post={notification.comment as LensterPost}
        showCard={false}
        type="COMMENT"
      />
    </div>
  )
}

export default NewCommentNotification
