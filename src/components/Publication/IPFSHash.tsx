import { Card, CardBody } from '@components/UI/Card'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import formatIPFSHash from '@lib/formatIPFSHash'
import getIPFSHash from '@lib/getIPFSHash'
import React, { FC } from 'react'

interface Props {
  ipfsHash: string
}

const IPFSHash: FC<Props> = ({ ipfsHash }) => {
  const formattedHash = getIPFSHash(ipfsHash)

  if (!formattedHash) return null

  return (
    <Card testId="ipfs-hash">
      <CardBody className="text-sm text-gray-500">
        <a
          className="flex justify-between items-center"
          href={`https://ipfs.infura.io/ipfs/${formattedHash}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          <div className="flex items-center space-x-1">
            <div>IPFS METADATA</div>
            <ExternalLinkIcon className="w-4 h-4" />
          </div>
          {formattedHash ? (
            <div>{formatIPFSHash(formattedHash)}</div>
          ) : (
            <div>OOPS</div>
          )}
        </a>
      </CardBody>
    </Card>
  )
}

export default IPFSHash
