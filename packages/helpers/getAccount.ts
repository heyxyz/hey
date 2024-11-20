import type { Profile } from "@hey/lens";
import sanitizeDisplayName from "./sanitizeDisplayName";

const getAccount = (
  account: null | Profile,
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

  const prefix = account.handle ? "@" : "#";
  const slug = account.handle?.localName || account.id;
  const link = account.handle
    ? `/u/${account.handle.localName}`
    : `/profile/${account.id}`;

  return {
    displayName: sanitizeDisplayName(account.metadata?.displayName) || slug,
    link: link,
    slug,
    slugWithPrefix: `${prefix}${slug}`,
    sourceLink: source ? `${link}?source=${source}` : link,
    staffLink: `/staff/users/${account.id}`
  };
};

export default getAccount;
