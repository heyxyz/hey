import { Profile } from '@generated/types'
import React, { FC } from 'react'

import Ens from './Enss'
import ProofOfHumanity from './ProofOfHumanity'
import Sybil from './Sybil'

interface Props {
  profile: Profile
}

const Badges: FC<Props> = ({ profile }) => {
  const hasOnChainIdentity =
    profile?.onChainIdentity?.proofOfHumanity ||
    profile?.onChainIdentity?.sybilDotOrg?.verified ||
    profile?.onChainIdentity?.ens?.name

  if (!hasOnChainIdentity) return null

  return (
    <>
      <div className="w-full divider" />
      <div className="flex flex-row gap-3">
        <ProofOfHumanity profile={profile} />
        <Ens profile={profile} />
        <Sybil profile={profile} />
      </div>
    </>
  )
}

export default Badges
