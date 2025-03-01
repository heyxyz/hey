import { NULL_ADDRESS } from "@hey/data/constants";
import type { AccountFragment } from "@hey/indexer";

const isAccountDeleted = (account: AccountFragment): boolean => {
  if (account.owner === NULL_ADDRESS) {
    return true;
  }

  return false;
};

export default isAccountDeleted;
