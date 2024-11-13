import type { AnyPublication } from "@hey/lens";

type Typename<T = string> = { [key in "__typename"]?: T };

type PickByTypename<
  T extends Typename,
  P extends T["__typename"] | undefined
> = T extends {
  __typename?: P;
}
  ? T
  : never;

export function isRepost<T extends AnyPublication>(
  post: null | T
): post is PickByTypename<T, "Mirror"> {
  return post?.__typename === "Mirror";
}

export function isCommentPost<T extends AnyPublication>(
  post: T
): post is PickByTypename<T, "Comment"> {
  return post?.__typename === "Comment";
}
