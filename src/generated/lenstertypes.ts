import {
  Comment,
  EmptyCollectModuleSettings,
  FeeCollectModuleSettings,
  LimitedFeeCollectModuleSettings,
  LimitedTimedFeeCollectModuleSettings,
  Mirror,
  NewCollectNotification,
  NewCommentNotification,
  NewMirrorNotification,
  Post,
  RevertCollectModuleSettings,
  TimedFeeCollectModuleSettings
} from './types'

export type LensterPost = Post & Mirror & Comment & { pubId: string }
export type Community = Post
export type LensterCollectModule = EmptyCollectModuleSettings &
  FeeCollectModuleSettings &
  LimitedFeeCollectModuleSettings &
  LimitedTimedFeeCollectModuleSettings &
  RevertCollectModuleSettings &
  TimedFeeCollectModuleSettings
export type LensterNewMirrorNotification = NewMirrorNotification & {
  publication: { pubId: string }
}
export type LensterNewCommentNotification = NewCommentNotification & {
  comment: { pubId: string }
}
export type LensterNewCollectNotification = NewCollectNotification & {
  collectedPublication: { pubId: string }
}
