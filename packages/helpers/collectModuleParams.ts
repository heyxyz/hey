import {
  PostActionConfigInput,
  PostActionType
} from "@hey/indexer";
import type { CollectModuleType } from "@hey/types/hey";

const collectModuleParams = (
  collectModule: CollectModuleType
): PostActionConfigInput | null => {
  const {
    amount,
    collectLimit,
    endsAt,
    recipients
  } = collectModule;

  switch (collectModule.type) {
    case PostActionType.SimpleCollect:
      return { simpleCollect: {
        amount: amount || undefined,
        collectLimit: collectLimit || undefined,
        endsAt: endsAt || undefined,
        recipients: recipients || undefined
      } };
    default:
      return null;
  }
};

export default collectModuleParams;
