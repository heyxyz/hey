import type {
  LegacyMultirecipientFeeCollectModuleSettings,
  LegacySimpleCollectModuleSettings,
  MultirecipientFeeCollectOpenActionSettings,
  RecipientDataOutput,
  SimpleCollectOpenActionSettings
} from '@hey/lens';

const getCollectModuleData = (
  collectModule:
    | LegacyMultirecipientFeeCollectModuleSettings
    | LegacySimpleCollectModuleSettings
    | MultirecipientFeeCollectOpenActionSettings
    | SimpleCollectOpenActionSettings
): {
  amount: number;
  assetAddress: string;
  assetDecimals: number;
  collectLimit?: number;
  endsAt?: string;
  followerOnly?: boolean;
  recipient?: string;
  recipients?: RecipientDataOutput[];
  referralFee?: number;
} | null => {
  switch (collectModule.__typename) {
    case 'LegacySimpleCollectModuleSettings':
    case 'SimpleCollectOpenActionSettings':
      return {
        amount: parseFloat(collectModule.amount.value || '0'),
        assetAddress: collectModule.amount.asset.contract.address,
        assetDecimals: collectModule.amount.asset.decimals,
        collectLimit: parseInt(collectModule.collectLimit || '0'),
        endsAt: collectModule.endsAt,
        followerOnly: collectModule.followerOnly,
        recipient: collectModule.recipient,
        referralFee: collectModule.referralFee
      };
    case 'LegacyMultirecipientFeeCollectModuleSettings':
    case 'MultirecipientFeeCollectOpenActionSettings':
      return {
        amount: parseFloat(collectModule.amount.value || '0'),
        assetAddress: collectModule.amount.asset.contract.address,
        assetDecimals: collectModule.amount.asset.decimals,
        collectLimit: parseInt(collectModule.collectLimit || '0'),
        endsAt: collectModule.endsAt,
        followerOnly: collectModule.followerOnly,
        recipients: collectModule.recipients,
        referralFee: collectModule.referralFee
      };

    default:
      return null;
  }
};

export default getCollectModuleData;
