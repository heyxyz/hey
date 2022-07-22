import { Tooltip } from '@components/UI/Tooltip'
import { Profile } from '@generated/types'
import { CheckCircleIcon } from '@heroicons/react/solid'
import React, { FC } from 'react'
import { STATIC_ASSETS } from 'src/constants'

interface Props {
  profile: Profile
}

const ProofOfHumanity: FC<Props> = ({ profile }) => {
  if (!profile?.onChainIdentity?.proofOfHumanity) return null

  return (
    <Tooltip
      content={
        <span className="flex items-center space-x-1">
          <span>Proof of Humanity verified</span>
          <CheckCircleIcon className="h-4 w-4" />
        </span>
      }
      placement="top"
    >
      <img
        className="drop-shadow-xl"
        height={75}
        width={75}
        src={`${STATIC_ASSETS}/badges/poh.png`}
        alt="Proof Of Humanity Badge"
      />
    </Tooltip>
  )
}

export default ProofOfHumanity
