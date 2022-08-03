import { LensterPublication } from '@generated/lenstertypes'
import React, { FC, MouseEvent } from 'react'

import Collect from './Collect'
import Comment from './Comment'
import Like from './Like'
import PostMenu from './Menu'
import Mirror from './Mirror'

interface Props {
  publication: LensterPublication
}

const PublicationActions: FC<Props> = ({ publication }) => {
  const postType = publication?.metadata?.attributes[0]?.value

  return postType !== 'community' ? (
    <div
      className="flex gap-6 items-center pt-3 -ml-2 text-gray-500 sm:gap-8"
      onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}
    >
      <Comment post={publication} />
      <Mirror post={publication} />
      <Like post={publication} />
      {publication?.collectModule?.__typename !==
        'RevertCollectModuleSettings' &&
        postType !== 'crowdfund' && <Collect post={publication} />}
      <PostMenu post={publication} />
    </div>
  ) : null
}

export default PublicationActions
