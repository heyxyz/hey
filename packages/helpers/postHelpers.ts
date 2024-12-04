import type { AnyPost } from "@hey/indexer";

export function isRepost(post: AnyPost) {
  return post.__typename === "Repost";
}
