import { Wallet } from '@generated/types'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import { formatUsername } from '@lib/formatUsername'
import React from 'react'

import Slug from './Slug'

interface Props {
  wallet: Wallet
}

const WalletProfile: React.FC<Props> = ({ wallet }) => {
  return (
    <div className="flex items-center justify-between">
      <a
        className="flex items-center space-x-3"
        href={`https://mumbai.polygonscan.com/address/${wallet?.address}`}
        target="_blank"
        rel="noreferrer"
      >
        <img
          src={`https://avatar.tobi.sh/${wallet?.address}.png`}
          className="w-10 h-10 bg-gray-200 border rounded-full"
          alt={wallet?.address}
        />
        <div>
          <div className="flex gap-1.5 items-center">
            <div>{formatUsername(wallet?.address)}</div>
            <ExternalLinkIcon className="w-4 h-4" />
          </div>
          <Slug className="text-sm" slug={formatUsername(wallet?.address)} />
        </div>
      </a>
    </div>
  )
}

export default WalletProfile
