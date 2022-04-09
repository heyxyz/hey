import {
  Comment,
  FeeCollectModuleSettings,
  FreeCollectModuleSettings,
  LimitedFeeCollectModuleSettings,
  LimitedTimedFeeCollectModuleSettings,
  Mirror,
  Post,
  RevertCollectModuleSettings,
  TimedFeeCollectModuleSettings
} from './types'

export type LensterPost = Post & Mirror & Comment & { pubId: string }
export type Community = Post
export type LensterCollectModule = FreeCollectModuleSettings &
  FeeCollectModuleSettings &
  LimitedFeeCollectModuleSettings &
  LimitedTimedFeeCollectModuleSettings &
  RevertCollectModuleSettings &
  TimedFeeCollectModuleSettings
