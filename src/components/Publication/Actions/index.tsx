import { LensterPublication } from '@generated/lenstertypes'
import React, { FC, MouseEvent } from 'react'

import Collect from './Collect'
import Comment from './Comment'
import Like from './Like'
import PublicationMenu from './Menu'
import Mirror from './Mirror'

interface Props {
  publication: LensterPublication
}

const PublicationActions: FC<Props> = ({ publication }) => {
  const publicationType = publication?.metadata?.attributes[0]?.value

  return publicationType !== 'community' ? (
    <div
      className="flex gap-6 items-center pt-3 -ml-2 text-gray-500 sm:gap-8"
      onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}
    >
      <Comment publication={publication} />
      <Mirror publication={publication} />
      <Like publication={publication} />
      {publication?.collectModule?.__typename !==
        'RevertCollectModuleSettings' &&
        publicationType !== 'crowdfund' && (
          <Collect publication={publication} />
        )}
      <PublicationMenu publication={publication} />
    </div>
  ) : null
}

export default PublicationActions
