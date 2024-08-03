import type {
  AmountInput,
  CollectActionModuleInput,
  RecipientDataInput
} from '@hey/lens';
import type { CollectModuleType } from '@hey/types/hey';

import { REWARDS_ADDRESS, PWYW_COLLECT_MODULE_ADDRESS, COLLECT_PUBLICATION_ACTION_ADDRESS } from '@hey/data/constants';
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
    referralFee,
    currency
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
          referralFee: referralFee || undefined
        }
      };
    case 'PWYWCollectModule':
      return {
        unknownOpenAction: {
          address: PWYW_COLLECT_MODULE_ADDRESS,
          data: encodeData(
            [
              { type: 'uint160', name: 'amountFloor' },
              { type: 'uint96', name: 'collectLimit' },
              { type: 'address', name: 'currency' },
              { type: 'uint16', name: 'referralFee' },
              { type: 'bool', name: 'followerOnly' },
              { type: 'uint72', name: 'endTimestamp' },
              {
                type: 'tuple(address,uint16)[5]',
                name: 'recipients',
                components: [
                  { type: 'address', name: 'recipient' },
                  { type: 'uint16', name: 'split' },
                ],
              },
            ],
            [
              amount ? parseEther(amount.value).toString() : '0',
              collectLimit || '0',
              currency || ZERO_ADDRESS,
              referralFee || '0',
              followerOnly || false,
              endsAt ? new Date(endsAt).getTime() / 1000 : '0',
              adjustedSplits,
            ]
          ),
        },
      };
    default:
      return null;
  }
};

export default collectModuleParams;