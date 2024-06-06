import type {
  AmountInput,
  CollectActionModuleInput,
  RecipientDataInput
} from '@good/lens';
import type { CollectModuleType } from '@good/types/good';

import { REWARDS_ADDRESS } from '@good/data/constants';
import { CollectOpenActionModuleType } from '@good/lens';

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

  // Calculate adjusted splits and convert to whole numbers
  let totalPercentage = 0;
  const adjustedSplits = recipients?.map((split) => {
    let adjustedSplit = Math.floor(split.split * (userPercentage / 100));
    totalPercentage += adjustedSplit;
    return {
      recipient: split.recipient,
      split: adjustedSplit
    };
  });

  if (adjustedSplits && adjustedSplits.length > 0) {
    // Ensure no split is zero and adjust the first recipient's split if necessary
    let sumNonZeroAdjustments = 0;
    for (const split of adjustedSplits) {
      if (split.split === 0 && userPercentage - totalPercentage > 0) {
        split.split++;
        sumNonZeroAdjustments++;
      }
    }

    // Adjust the first recipient's split to ensure total is 100%
    adjustedSplits[0].split +=
      userPercentage - totalPercentage - sumNonZeroAdjustments;
  }

  // Add the admin fee split
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
