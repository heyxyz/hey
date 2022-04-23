import { Card, CardBody } from '@components/UI/Card'
import { Nft } from '@generated/types'
import imagekitURL from '@lib/imagekitURL'
import React, { FC } from 'react'
import { CHAIN_ID, OPENSEA_URL, STATIC_ASSETS } from 'src/constants'

interface Props {
  nft: Nft
}

const SingleNFT: FC<Props> = ({ nft }) => {
  return (
    <Card>
      <div
        className="h-52 border-b sm:h-80 sm:rounded-t-[10px]"
        style={{
          backgroundImage: `url(${imagekitURL(
            nft.originalContent.uri
              ? nft.originalContent.uri
              : `${STATIC_ASSETS}/placeholder.webp`
          )})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <CardBody>
        {nft.collectionName && (
          // TODO: fix collection url
          <a
            className="text-sm text-gray-500 truncate"
            href={`${OPENSEA_URL}/collection/${nft.collectionName}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            {nft.collectionName}
          </a>
        )}
        <div className="truncate">
          <a
            className="font-bold"
            href={`${OPENSEA_URL}/assets/${
              nft.chainId === CHAIN_ID ? 'matic/' : ''
            }${nft.contractAddress}/${nft.tokenId}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            {nft.name ? nft.name : `#${nft.tokenId}`}
          </a>
        </div>
      </CardBody>
    </Card>
  )
}

export default SingleNFT
