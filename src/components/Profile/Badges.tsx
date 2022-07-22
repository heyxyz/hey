import { Profile } from '@generated/types'
import React, { FC } from 'react'
import { STATIC_ASSETS } from 'src/constants'

interface Props {
  profile: Profile
}

const Badges: FC<Props> = ({ profile }) => {
  const hasOnChainIdentity =
    profile?.onChainIdentity?.proofOfHumanity ||
    profile?.onChainIdentity?.ens?.name

  if (!hasOnChainIdentity) return null

  return (
    <>
      <div className="w-full divider" />
      <div className="flex flex-row gap-3">
        {profile?.onChainIdentity?.proofOfHumanity && (
          <img
            className="drop-shadow-xl"
            height={75}
            width={75}
            src={`${STATIC_ASSETS}/badges/poh.png`}
            alt="POH Badge"
          />
        )}
        {profile?.onChainIdentity?.ens?.name && (
          <img
            className="drop-shadow-xl"
            height={75}
            width={75}
            src={`${STATIC_ASSETS}/badges/ens.png`}
            alt="ENS Badge"
          />
        )}
      </div>
    </>
  )
}

export default Badges
