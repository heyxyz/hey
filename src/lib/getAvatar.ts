import { Profile } from '@generated/types'

import getIPFSLink from './getIPFSLink'
import imagekitURL from './imagekitURL'

const getAvatar = (profile: Profile): string => {
  return imagekitURL(
    // @ts-ignore
    profile?.picture?.original?.url
      ? // @ts-ignore
        getIPFSLink(profile?.picture?.original?.url)
      : `https://avatar.tobi.sh/${profile?.ownedBy}.png`,
    250,
    250
  )
}

export default getAvatar
