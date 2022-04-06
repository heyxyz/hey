import { REVERT_COLLECT_MODULE } from 'src/constants'

export const getModule = (
  name: string
): {
  name: string
  hasParam?: boolean
  config?: any
  type: string
} => {
  switch (name) {
    // Collect Modules
    case 'FeeCollectModule':
      return {
        name: 'Fee Collect',
        hasParam: true,
        config: 'feeCollectModule',
        type: 'collectModule'
      }
    case 'LimitedFeeCollectModule':
      return {
        name: 'Limited Fee Collect',
        hasParam: true,
        config: 'limitedFeeCollectModule',
        type: 'collectModule'
      }
    case 'LimitedTimedFeeCollectModule':
      return {
        name: 'Limited Time Fee Collect',
        hasParam: true,
        config: 'limitedTimedFeeCollectModule',
        type: 'collectModule'
      }
    case 'TimedFeeCollectModule':
      return {
        name: 'Timed Fee Collect',
        hasParam: true,
        config: 'timedFeeCollectModule',
        type: 'collectModule'
      }
    case 'RevertCollectModule':
      return {
        name: 'Revert Collect',
        hasParam: false,
        config: {
          revertCollectModule: true
        },
        type: 'collectModule'
      }
    case 'FreeCollectModule':
      return {
        name: 'Free Collect',
        hasParam: false,
        config: {
          freeCollectModule: { followerOnly: true }
        },
        type: 'collectModule'
      }

    // Follow modules
    case 'FeeFollowModule':
      return {
        name: 'Fee Follow',
        type: 'followModule'
      }

    // Reference modules
    case 'FollowerOnlyReferenceModule':
      return {
        name: 'Follower Only Reference',
        type: 'referenceModule'
      }
    default:
      return { name: name, type: 'collectModule' }
  }
}

export type FEE_DATA_TYPE = {
  amount: { currency: string; value: string }
  collectLimit: string | null
  recipient: string
  referralFee: number
}

export const defaultModuleData = {
  moduleName: 'RevertCollectModule',
  contractAddress: REVERT_COLLECT_MODULE,
  inputParams: [],
  redeemParams: [],
  returnDataParms: []
}

export const defaultFeeData = {
  amount: { currency: '', value: '' },
  collectLimit: '',
  recipient: '',
  referralFee: 0
}
