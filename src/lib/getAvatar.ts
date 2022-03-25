import { Profile } from '@generated/types'

export const getAvatar = (profile: Profile) => {
  // @ts-ignore
  return profile?.picture?.original?.url
    ? // @ts-ignore
      profile?.picture?.original?.url
    : `https://avatar.tobi.sh/${profile?.ownedBy}.svg`
}
