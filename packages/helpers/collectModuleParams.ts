import type { PostActionConfigInput } from "@hey/indexer";
import type { CollectModuleType } from "@hey/types/hey";

const collectModuleParams = (
  collectModule: CollectModuleType
): PostActionConfigInput | null => {
  const { amount, collectLimit, endsAt, recipients, referralShare } =
    collectModule;

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

export default collectModuleParams;
