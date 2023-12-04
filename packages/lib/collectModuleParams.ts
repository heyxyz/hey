import type {
  AmountInput,
  CollectActionModuleInput,
  Profile,
  RecipientDataInput
} from '@hey/lens';
import type { CollectModuleType } from '@hey/types/hey';

import { CollectOpenActionModuleType } from '@hey/lens';

const collectModuleParams = (
  collectModule: CollectModuleType,
  currentProfile: Profile
): CollectActionModuleInput | null => {
  const {
    amount,
    collectLimit,
    endsAt,
    followerOnly,
    recipients,
    referralFee
  } = collectModule;
  const baseCollectModuleParams = {
    collectLimit: collectLimit,
    endsAt: endsAt,
    followerOnly: followerOnly || false
  };

  switch (collectModule.type) {
    case CollectOpenActionModuleType.SimpleCollectOpenActionModule:
      return {
        simpleCollectOpenAction: {
          ...baseCollectModuleParams,
          ...(amount && {
            amount: amount,
            recipient: currentProfile?.ownedBy.address,
            referralFee: referralFee
          })
        }
      };
    case CollectOpenActionModuleType.MultirecipientFeeCollectOpenActionModule:
      return {
        multirecipientCollectOpenAction: {
          ...baseCollectModuleParams,
          amount: amount as AmountInput,
          recipients: recipients as RecipientDataInput[],
          referralFee: referralFee
        }
      };
    default:
      return null;
  }
};

export default collectModuleParams;
