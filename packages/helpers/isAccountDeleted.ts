import { NULL_ADDRESS } from "@hey/data/constants";
import type { Account } from "@hey/indexer";

const isAccountDeleted = (account: Account): boolean => {
  if (account.owner === NULL_ADDRESS) {
    return true;
  }

  return false;
};

export default isAccountDeleted;
