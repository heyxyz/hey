import { REVERT_COLLECT_MODULE } from 'src/constants'

export const getModule = (
  name: string
): {
  name: string
  hasParam?: boolean
  config?: any
} => {
  switch (name) {
    // Collect Modules
    case 'FeeCollectModule':
      return {
        name: 'Fee Collect',
        hasParam: true,
        config: 'feeCollectModule'
      }
    case 'LimitedFeeCollectModule':
      return {
        name: 'Limted Fee Collect',
        hasParam: true,
        config: 'limitedFeeCollectModule'
      }
    case 'LimitedTimedFeeCollectModule':
      return {
        name: 'Limted Time Fee Collect',
        hasParam: true,
        config: 'limitedTimedFeeCollectModule'
      }
    case 'TimedFeeCollectModule':
      return {
        name: 'Timed Fee Collect',
        hasParam: true,
        config: 'timedFeeCollectModule'
      }
    case 'RevertCollectModule':
      return {
        name: 'Revert Collect',
        hasParam: false,
        config: {
          revertCollectModule: true
        }
      }
    case 'EmptyCollectModule':
      return {
        name: 'Empty Collect',
        hasParam: false,
        config: {
          emptyCollectModule: true
        }
      }

    // Follow modules
    case 'FeeFollowModule':
      return {
        name: 'Fee Follow'
      }

    // Reference modules
    case 'FollowerOnlyReferenceModule':
      return {
        name: 'Follower Only Reference'
      }
    default:
      return { name: name }
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
