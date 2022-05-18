import { Card, CardBody } from '@components/UI/Card'
import { Nft } from '@generated/types'
import getIPFSLink from '@lib/getIPFSLink'
import React, { FC } from 'react'
import { CHAIN_ID, OPENSEA_URL, STATIC_ASSETS } from 'src/constants'

interface Props {
  nft: Nft
}

const SingleNFT: FC<Props> = ({ nft }) => {
  const nftURL = `${OPENSEA_URL}/assets/${
    nft.chainId === CHAIN_ID ? 'matic/' : ''
  }${nft.contractAddress}/${nft.tokenId}`

  return (
    <Card>
      <a href={nftURL} target="_blank" rel="noreferrer noopener">
        {nft?.originalContent?.animatedUrl ? (
          <div className="h-52 border-b sm:h-80 sm:rounded-t-[10px]">
            <iframe
              className="w-full h-full"
              src={nft?.originalContent?.animatedUrl}
            />
          </div>
        ) : (
          <div
            className="h-52 border-b sm:h-80 sm:rounded-t-[10px]"
            style={{
              backgroundImage: `url(${
                nft.originalContent.uri
                  ? getIPFSLink(nft.originalContent.uri)
                  : `${STATIC_ASSETS}/placeholder.webp`
              })`,
              backgroundSize: 'contain',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        )}
      </a>
      <CardBody className="space-y-1">
        {nft.collectionName && (
          <div className="text-sm text-gray-500 truncate">
            {nft.collectionName}
          </div>
        )}
        <div className="truncate">
          <a
            className="font-bold"
            href={nftURL}
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
