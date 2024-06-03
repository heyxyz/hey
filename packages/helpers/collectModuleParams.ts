import type {
  AmountInput,
  CollectActionModuleInput,
  RecipientDataInput
} from '@hey/lens';
import type { CollectModuleType } from '@hey/types/hey';

import { CollectOpenActionModuleType } from '@hey/lens';

const collectModuleParams = (
  collectModule: CollectModuleType
): CollectActionModuleInput | null => {
  const {
    amount,
    collectLimit,
    endsAt,
    followerOnly,
    recipient,
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
            amount,
            recipient,
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
