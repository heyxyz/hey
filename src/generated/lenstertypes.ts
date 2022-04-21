import {
  Comment,
  FeeCollectModuleSettings,
  FreeCollectModuleSettings,
  LimitedFeeCollectModuleSettings,
  LimitedTimedFeeCollectModuleSettings,
  Mirror,
  Notification,
  Post,
  Profile,
  RevertCollectModuleSettings,
  TimedFeeCollectModuleSettings
} from './types'

export type LensterPost = Post & Mirror & Comment & { pubId: string }
export type LensterNotification = Notification & { profile: Profile }
export type Community = Post
export type LensterCollectModule = FreeCollectModuleSettings &
  FeeCollectModuleSettings &
  LimitedFeeCollectModuleSettings &
  LimitedTimedFeeCollectModuleSettings &
  RevertCollectModuleSettings &
  TimedFeeCollectModuleSettings
export type LensterAttachment = { item: string; type: string }
export type UserSuggestion = {
  uid: string
  id: string
  display: string
  name: string
  picture: string
}
