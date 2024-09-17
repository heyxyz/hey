import type {
  MultirecipientFeeCollectOpenActionSettings,
  RecipientDataOutput,
  SimpleCollectOpenActionSettings
} from "@hey/lens";

const getCollectModuleData = (
  collectModule:
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
    case "SimpleCollectOpenActionSettings":
      return {
        amount: Number.parseFloat(collectModule.amount.value || "0"),
        assetAddress: collectModule.amount.asset.contract.address,
        assetDecimals: collectModule.amount.asset.decimals,
        assetSymbol: collectModule.amount.asset.symbol,
        collectLimit: Number.parseInt(collectModule.collectLimit || "0"),
        endsAt: collectModule.endsAt,
        followerOnly: collectModule.followerOnly,
        recipient: collectModule.recipient,
        referralFee: collectModule.referralFee
      };
    case "MultirecipientFeeCollectOpenActionSettings":
      return {
        amount: Number.parseFloat(collectModule.amount.value || "0"),
        assetAddress: collectModule.amount.asset.contract.address,
        assetDecimals: collectModule.amount.asset.decimals,
        assetSymbol: collectModule.amount.asset.symbol,
        collectLimit: Number.parseInt(collectModule.collectLimit || "0"),
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
