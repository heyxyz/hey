import { LensterPublication } from '@generated/lenstertypes'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

import Collected from './Collected'
import Commented from './Commented'
import CommentedPublication from './CommentedPublication'
import CommunityPublication from './CommunityPost'
import Mirrored from './Mirrored'

interface Props {
  publication: LensterPublication
  showType?: boolean
  showThread?: boolean
}

const PublicationType: FC<Props> = ({
  publication,
  showType,
  showThread = false
}) => {
  const { pathname } = useRouter()
  const type = publication?.__typename
  const publicationType = publication?.metadata?.attributes[0]?.value
  const isCollected = !!publication?.collectedBy
  const isCommunityPost = publicationType === 'community post'

  if (!showType) return null

  return (
    <>
      {type === 'Mirror' && <Mirrored publication={publication} />}
      {type === 'Comment' && !showThread && !isCommunityPost && (
        <CommentedPublication publication={publication} />
      )}
      {type === 'Comment' && showThread && !isCollected && !isCommunityPost && (
        <Commented publication={publication} />
      )}
      {isCommunityPost &&
        pathname !== '/communities/[id]' &&
        type !== 'Mirror' && <CommunityPublication publication={publication} />}
      {isCollected &&
        publicationType !== 'community' &&
        publicationType !== 'crowdfund' && (
          <Collected publication={publication} type="Collected" />
        )}
      {isCollected && publicationType === 'crowdfund' && (
        <Collected publication={publication} type="Funded" />
      )}
    </>
  )
}

export default PublicationType
