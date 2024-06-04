import type {
  AmountInput,
  CollectActionModuleInput,
  RecipientDataInput
} from '@hey/lens';
import type { CollectModuleType } from '@hey/types/hey';

import { REWARDS_ADDRESS } from '@hey/data/constants';
import { CollectOpenActionModuleType } from '@hey/lens';

const collectModuleParams = (
  collectModule: CollectModuleType
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

  const adminFeePercentage = 5;
  const userPercentage = 100 - adminFeePercentage;

  const adjustedSplits = recipients?.map((split) => ({
    recipient: split.recipient,
    split: split.split * (userPercentage / 100)
  }));

  adjustedSplits?.push({
    recipient: REWARDS_ADDRESS,
    split: adminFeePercentage
  });

  switch (collectModule.type) {
    case CollectOpenActionModuleType.SimpleCollectOpenActionModule:
      return { simpleCollectOpenAction: baseCollectModuleParams };
    case CollectOpenActionModuleType.MultirecipientFeeCollectOpenActionModule:
      return {
        multirecipientCollectOpenAction: {
          ...baseCollectModuleParams,
          amount: amount as AmountInput,
          recipients: adjustedSplits as RecipientDataInput[],
          referralFee: referralFee
        }
      };
    default:
      return null;
  }
};

export default collectModuleParams;
