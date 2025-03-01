import { NULL_ADDRESS } from "@hey/data/constants";
import type { AccountFieldsFragment } from "@hey/indexer";

const isAccountDeleted = (account: AccountFieldsFragment): boolean => {
  if (account.owner === NULL_ADDRESS) {
    return true;
  }

  return false;
};

export default isAccountDeleted;
