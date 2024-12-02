import type { Account } from "@hey/indexer";
import sanitizeDisplayName from "./sanitizeDisplayName";

const getAccount = (
  account: Account | null,
  source?: string
): {
  name: string;
  link: string;
  slug: string;
  slugWithPrefix: string;
  sourceLink: string;
  staffLink: string;
} => {
  if (!account) {
    return {
      name: "...",
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
    name: sanitizeDisplayName(account.metadata?.name) || slug,
    link: link,
    slug,
    slugWithPrefix: `${prefix}${slug}`,
    sourceLink: source ? `${link}?source=${source}` : link,
    staffLink: `/staff/users/${account.address}`
  };
};

export default getAccount;
