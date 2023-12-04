import type {
  AmountInput,
  CollectActionModuleInput,
  Profile,
  RecipientDataInput
} from '@hey/lens';
import { CollectOpenActionModuleType } from '@hey/lens';
import type { CollectModuleType } from '@hey/types/hey';

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
    followerOnly: followerOnly || false,
    endsAt: endsAt
  };

  switch (collectModule.type) {
    case CollectOpenActionModuleType.SimpleCollectOpenActionModule:
      return {
        simpleCollectOpenAction: {
          ...baseCollectModuleParams,
          ...(amount && {
            referralFee: referralFee,
            amount: amount,
            recipient: currentProfile?.ownedBy.address
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
