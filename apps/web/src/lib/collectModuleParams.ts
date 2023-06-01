import type {
  CollectModuleParams,
  ModuleFeeAmountParams,
  Profile,
  RecipientDataInput
} from '@lenster/lens';
import { CollectModules } from '@lenster/lens';
import type { CollectModuleType } from 'src/store/collect-module';

import { getTimeAddedNDay } from './formatTime';

const collectModuleParams = (
  collectModule: CollectModuleType,
  currentProfile: Profile
): CollectModuleParams => {
  const {
    collectLimit,
    followerOnlyCollect,
    timeLimit,
    amount,
    referralFee,
    recipients
  } = collectModule;
  const baseCollectModuleParams = {
    collectLimit: collectLimit,
    followerOnly: followerOnlyCollect as boolean,
    endTimestamp: timeLimit ? getTimeAddedNDay(1) : null
  };

  const baseAmountParams = {
    amount: amount as ModuleFeeAmountParams,
    referralFee: referralFee as number
  };

  switch (collectModule.type) {
    case CollectModules.SimpleCollectModule:
      return {
        simpleCollectModule: {
          ...baseCollectModuleParams,
          ...(amount && {
            fee: {
              ...baseAmountParams,
              recipient: currentProfile?.ownedBy
            }
          })
        }
      };
    case CollectModules.MultirecipientFeeCollectModule:
      return {
        multirecipientFeeCollectModule: {
          ...baseCollectModuleParams,
          ...baseAmountParams,
          recipients: recipients as RecipientDataInput[]
        }
      };
    default:
      return { revertCollectModule: true };
  }
};

export default collectModuleParams;
