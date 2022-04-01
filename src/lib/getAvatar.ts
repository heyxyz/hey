import { Profile } from '@generated/types'

import { imagekitURL } from './imagekitURL'

export const getAvatar = (profile: Profile) => {
  return imagekitURL(
    // @ts-ignore
    profile?.picture?.original?.url
      ? // @ts-ignore
        profile?.picture?.original?.url
      : `https://avatar.tobi.sh/${profile?.ownedBy}.svg`,
    500,
    500
  )
}
