import type { Account, MeResult } from "@hey/indexer";
import sanitizeDisplayName from "./sanitizeDisplayName";

const getAccount = (
  account: null | Account | MeResult,
  source?: string
): {
  displayName: string;
  link: string;
  slug: string;
  slugWithPrefix: string;
  sourceLink: string;
  staffLink: string;
} => {
  if (!account) {
    return {
      displayName: "...",
      link: "",
      slug: "...",
      slugWithPrefix: "...",
      sourceLink: "",
      staffLink: ""
    };
  }

  const prefix = account.username ? "@" : "#";
  const slug = account.username?.value || account.address;
  const link = account.username
    ? `/u/${account.username.value}`
    : `/account/${account.address}`;

  return {
    displayName: sanitizeDisplayName(account.metadata?.name) || slug,
    link: link,
    slug,
    slugWithPrefix: `${prefix}${slug}`,
    sourceLink: source ? `${link}?source=${source}` : link,
    staffLink: `/staff/users/${account.address}`
  };
};

export default getAccount;
