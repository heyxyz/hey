import type {
  RecipientPercent,
  SimpleCollectActionFragment
} from "@hey/indexer";

const getCollectActionData = (
  collectAction: SimpleCollectActionFragment
): {
  amount?: number;
  assetAddress?: string;
  assetDecimals?: number;
  assetSymbol?: string;
  collectLimit?: number;
  endsAt?: string;
  recipients?: RecipientPercent[];
} | null => {
  switch (collectAction.__typename) {
    case "SimpleCollectAction":
      return {
        amount: Number.parseFloat(collectAction.amount?.value || "0"),
        assetAddress: collectAction.amount?.asset?.contract?.address,
        assetDecimals: collectAction.amount?.asset?.decimals,
        assetSymbol: collectAction.amount?.asset?.symbol,
        collectLimit: Number(collectAction.collectLimit),
        endsAt: collectAction.endsAt,
        recipients: collectAction.recipients || []
      };
    default:
      return null;
  }
};

export default getCollectActionData;
