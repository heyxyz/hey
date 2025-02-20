import type { PostActionConfigInput } from "@hey/indexer";
import type { CollectActionType } from "@hey/types/hey";

const collectActionParams = (
  collectAction: CollectActionType
): PostActionConfigInput | null => {
  const { amount, collectLimit, endsAt, recipients, referralShare } =
    collectAction;

  return {
    simpleCollect: {
      amount: amount || undefined,
      collectLimit: collectLimit || undefined,
      endsAt: endsAt || undefined,
      recipients: recipients || undefined,
      referralShare: referralShare || undefined
    }
  };
};

export default collectActionParams;
