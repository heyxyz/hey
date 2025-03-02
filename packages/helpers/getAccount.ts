import { LENS_NAMESPACE } from "@hey/data/constants";
import type { AccountFragment } from "@hey/indexer";
import formatAddress from "./formatAddress";
import isAccountDeleted from "./isAccountDeleted";
import sanitizeDisplayName from "./sanitizeDisplayName";

const getAccount = (
  account?: AccountFragment
): {
  name: string;
  link: string;
  username: string;
  usernameWithPrefix: string;
} => {
  if (!account) {
    return {
      name: "...",
      link: "",
      username: "...",
      usernameWithPrefix: "..."
    };
  }

  if (isAccountDeleted(account)) {
    return {
      name: "Deleted Account",
      link: "",
      username: "deleted",
      usernameWithPrefix: "@deleted"
    };
  }

  const value = account.username?.value;
  const localName = account.username?.localName;
  const address = account.address;

  const prefix = account.username ? "@" : "#";
  const username =
    (value?.includes(LENS_NAMESPACE) ? localName : value) ||
    formatAddress(address);
  const link =
    account.username && value.includes(LENS_NAMESPACE)
      ? `/u/${localName}`
      : `/account/${address}`;

  return {
    name: sanitizeDisplayName(account.metadata?.name) || username,
    link: link,
    username,
    usernameWithPrefix: `${prefix}${username}`
  };
};

export default getAccount;
