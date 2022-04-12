import 'linkify-plugin-mention'

import { gql, useQuery } from '@apollo/client'
import { GridItemSix, GridLayout } from '@components/GridLayout'
import CrowdfundShimmer from '@components/Shared/Shimmer/CrowdfundShimmer'
import { Card } from '@components/UI/Card'
import { LensterCollectModule, LensterPost } from '@generated/lenstertypes'
import consoleLog from '@lib/consoleLog'
import React, { FC, useState } from 'react'

import CollectModule, { COLLECT_QUERY } from '../Actions/Collect/CollectModule'

export const CROWDFUND_REVENUE_QUERY = gql`
  query CrowdfundRevenue($request: PublicationRevenueQueryRequest!) {
    publicationRevenue(request: $request) {
      earnings {
        value
      }
    }
  }
`

interface Props {
  nft: LensterPost
}

const NFT: FC<Props> = ({ nft }) => {
  const [showMintersModal, setShowMintersModal] = useState<boolean>(false)
  const { data, loading } = useQuery(COLLECT_QUERY, {
    variables: { request: { publicationId: nft?.id } },
    skip: !nft?.id,
    onCompleted() {
      consoleLog(
        'Query',
        '#8b5cf6',
        `Fetched collect module details NFT:${nft?.id}`
      )
    }
  })

  // @ts-ignore
  const collectModule: LensterCollectModule = data?.publication?.collectModule

  if (loading) return <CrowdfundShimmer />

  return (
    <Card>
      <GridLayout className="!p-0" zeroGap>
        <GridItemSix>
          <img
            className="object-cover h-full rounded-l-xl"
            src={nft?.metadata?.cover?.original?.url}
            alt={nft?.id}
          />
        </GridItemSix>
        <GridItemSix className="px-3">
          <CollectModule post={nft} />
        </GridItemSix>
      </GridLayout>
    </Card>
  )
}

export default NFT
