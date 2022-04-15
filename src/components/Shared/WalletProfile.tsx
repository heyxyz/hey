import { Wallet } from '@generated/types'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import formatAddress from '@lib/formatAddress'
import imagekitURL from '@lib/imagekitURL'
import React, { FC } from 'react'
import { POLYGONSCAN_URL } from 'src/constants'

import Slug from './Slug'

interface Props {
  wallet: Wallet
}

const WalletProfile: FC<Props> = ({ wallet }) => {
  const address = wallet?.address?.toString()
  return (
    <div className="flex justify-between items-center">
      <a
        className="flex items-center space-x-3"
        href={`${POLYGONSCAN_URL}/address/${address}`}
        target="_blank"
        rel="noreferrer"
      >
        <img
          src={imagekitURL(`https://avatar.tobi.sh/${address}.png`, 500, 500)}
          className="w-10 h-10 bg-gray-200 rounded-full border"
          alt={address}
        />
        <div>
          <div className="flex gap-1.5 items-center">
            <div>{formatAddress(address)}</div>
            <ExternalLinkIcon className="w-4 h-4" />
          </div>
          <Slug className="text-sm" slug={formatAddress(address)} />
        </div>
      </a>
    </div>
  )
}

export default WalletProfile
