import { Profile } from '@generated/types'

import { getIPFSLink } from './getIPFSLink'
import { imagekitURL } from './imagekitURL'

export const getAvatar = (profile: Profile) => {
  return imagekitURL(
    // @ts-ignore
    profile?.picture?.original?.url
      ? // @ts-ignore
        getIPFSLink(profile?.picture?.original?.url)
      : `https://avatar.tobi.sh/${profile?.ownedBy}.png`,
    500,
    500
  )
}
