import type {
  AmountInput,
  CollectActionModuleInput,
  Profile,
  RecipientDataInput
} from '@lenster/lens';
import { CollectOpenActionModuleType } from '@lenster/lens';
import type { CollectModuleType } from 'src/store/collect-module';

import { getTimeAddedNDay } from './formatTime';

const collectModuleParams = (
  collectModule: CollectModuleType,
  currentProfile: Profile
): CollectActionModuleInput | null => {
  const {
    collectLimit,
    followerOnly,
    amount,
    referralFee,
    recipients,
    endsAt
  } = collectModule;
  const baseCollectModuleParams = {
    collectLimit: collectLimit,
    followerOnly: followerOnly,
    endsAt: endsAt ? getTimeAddedNDay(1) : null
  };

  switch (collectModule.type) {
    case CollectOpenActionModuleType.SimpleCollectOpenActionModule:
      return {
        simpleCollectOpenAction: {
          ...baseCollectModuleParams,
          ...(amount && {
            referralFee: referralFee,
            fee: {
              amount: amount,
              recipient: currentProfile?.ownedBy.address
            }
          })
        }
      };
    case CollectOpenActionModuleType.MultirecipientFeeCollectOpenActionModule:
      return {
        multirecipientCollectOpenAction: {
          ...baseCollectModuleParams,
          amount: amount as AmountInput,
          referralFee: referralFee,
          recipients: recipients as RecipientDataInput[]
        }
      };
    default:
      return null;
  }
};

export default collectModuleParams;
