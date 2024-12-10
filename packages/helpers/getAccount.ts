import type { Account } from "@hey/indexer";
import sanitizeDisplayName from "./sanitizeDisplayName";

const getAccount = (
  account: Account | null,
  source?: string
): {
  name: string;
  link: string;
  username: string;
  usernameWithPrefix: string;
  sourceLink: string;
  staffLink: string;
} => {
  if (!account) {
    return {
      name: "...",
      link: "",
      username: "...",
      usernameWithPrefix: "...",
      sourceLink: "",
      staffLink: ""
    };
  }

  const prefix = account.username ? "@" : "#";
  const username = account.username?.localName || account.address;
  const link = account.username
    ? `/u/${account.username.localName}`
    : `/account/${account.address}`;

  return {
    name: sanitizeDisplayName(account.metadata?.name) || username,
    link: link,
    username,
    usernameWithPrefix: `${prefix}${username}`,
    sourceLink: source ? `${link}?source=${source}` : link,
    staffLink: `/staff/accounts/${account.address}`
  };
};

export default getAccount;
