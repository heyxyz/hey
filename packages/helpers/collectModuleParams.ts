import type {
  AmountInput,
  CollectActionModuleInput,
  RecipientDataInput
} from "@hey/lens";
import type { CollectModuleType } from "@hey/types/hey";

import { COLLECT_FEES_ADDRESS } from "@hey/data/constants";
import { CollectOpenActionModuleType } from "@hey/lens";

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
    collectLimit: collectLimit || undefined,
    endsAt: endsAt || undefined,
    followerOnly: followerOnly || false
  };

  const adminFeePercentage = 5;
  const userPercentage = 100 - adminFeePercentage;

  // Calculate adjusted splits and convert to whole numbers
  let totalPercentage = 0;
  const adjustedSplits =
    recipients?.map((split) => {
      const adjustedSplit = Math.floor(split.split * (userPercentage / 100));
      totalPercentage += adjustedSplit;
      return {
        recipient: split.recipient,
        split: adjustedSplit
      };
    }) || [];

  if (adjustedSplits.length > 0) {
    let sumNonZeroAdjustments = 0;

    // Ensure no split is zero and adjust if necessary
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
  adjustedSplits.push({
    recipient: COLLECT_FEES_ADDRESS,
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
          referralFee: referralFee || undefined
        }
      };
    default:
      return null;
  }
};

export default collectModuleParams;
