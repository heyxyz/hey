import type {
  SimpleCollectAction
} from "@hey/indexer";

const getCollectActionData = (
  collectAction: SimpleCollectAction
): {
  amount?: number;
  assetAddress?: string;
  assetDecimals?: number;
  assetSymbol?: string;
  collectLimit?: number;
  endsAt?: string;
  recipients?: RecipientDataOutput[];
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
        recipients: collectAction.recipient,
      };
    default:
      return null;
  }
};

export default getCollectActionData;
