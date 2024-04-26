import type {
  LegacyFeeCollectModuleSettings,
  LegacyFreeCollectModuleSettings,
  LegacyLimitedFeeCollectModuleSettings,
  LegacyLimitedTimedFeeCollectModuleSettings,
  LegacyMultirecipientFeeCollectModuleSettings,
  LegacySimpleCollectModuleSettings,
  LegacyTimedFeeCollectModuleSettings,
  MultirecipientFeeCollectOpenActionSettings,
  RecipientDataOutput,
  SimpleCollectOpenActionSettings
} from '@hey/lens';

const getCollectModuleData = (
  collectModule:
    | LegacyFeeCollectModuleSettings
    | LegacyFreeCollectModuleSettings
    | LegacyLimitedFeeCollectModuleSettings
    | LegacyLimitedTimedFeeCollectModuleSettings
    | LegacyMultirecipientFeeCollectModuleSettings
    | LegacySimpleCollectModuleSettings
    | LegacyTimedFeeCollectModuleSettings
    | MultirecipientFeeCollectOpenActionSettings
    | SimpleCollectOpenActionSettings
): {
  amount?: number;
  assetAddress?: string;
  assetDecimals?: number;
  assetSymbol?: string;
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
        assetSymbol: collectModule.amount.asset.symbol,
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
        assetSymbol: collectModule.amount.asset.symbol,
        collectLimit: parseInt(collectModule.collectLimit || '0'),
        endsAt: collectModule.endsAt,
        followerOnly: collectModule.followerOnly,
        recipients: collectModule.recipients,
        referralFee: collectModule.referralFee
      };
    case 'LegacyFreeCollectModuleSettings':
      return {
        followerOnly: collectModule.followerOnly
      };
    case 'LegacyFeeCollectModuleSettings':
      return {
        amount: parseFloat(collectModule.amount.value || '0'),
        assetAddress: collectModule.amount.asset.contract.address,
        assetDecimals: collectModule.amount.asset.decimals,
        assetSymbol: collectModule.amount.asset.symbol,
        followerOnly: collectModule.followerOnly,
        recipient: collectModule.recipient,
        referralFee: collectModule.referralFee
      };
    case 'LegacyLimitedFeeCollectModuleSettings':
      return {
        amount: parseFloat(collectModule.amount.value || '0'),
        assetAddress: collectModule.amount.asset.contract.address,
        assetDecimals: collectModule.amount.asset.decimals,
        assetSymbol: collectModule.amount.asset.symbol,
        collectLimit: parseInt(collectModule.collectLimit || '0'),
        followerOnly: collectModule.followerOnly,
        recipient: collectModule.recipient,
        referralFee: collectModule.referralFee
      };
    case 'LegacyLimitedTimedFeeCollectModuleSettings':
      return {
        amount: parseFloat(collectModule.amount.value || '0'),
        assetAddress: collectModule.amount.asset.contract.address,
        assetDecimals: collectModule.amount.asset.decimals,
        assetSymbol: collectModule.amount.asset.symbol,
        collectLimit: parseInt(collectModule.collectLimit || '0'),
        endsAt: collectModule.endTimestamp,
        followerOnly: collectModule.followerOnly,
        recipient: collectModule.recipient,
        referralFee: collectModule.referralFee
      };
    case 'LegacyTimedFeeCollectModuleSettings':
      return {
        amount: parseFloat(collectModule.amount.value || '0'),
        assetAddress: collectModule.amount.asset.contract.address,
        assetDecimals: collectModule.amount.asset.decimals,
        assetSymbol: collectModule.amount.asset.symbol,
        endsAt: collectModule.endTimestamp,
        followerOnly: collectModule.followerOnly,
        recipient: collectModule.recipient,
        referralFee: collectModule.referralFee
      };
    default:
      return null;
  }
};

export default getCollectModuleData;
