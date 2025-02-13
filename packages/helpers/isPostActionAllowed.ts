import type { Maybe, PostAction } from "@hey/indexer";
import allowedCollectActionModules from "./allowedCollectActionModules";

const isPostActionAllowed = (postActions?: Maybe<PostAction[]>): boolean => {
  if (!postActions?.length) {
    return false;
  }

  return postActions.some((postAction) => {
    const { __typename } = postAction;

    return allowedCollectActionModules.includes(__typename);
  });
};

export default isPostActionAllowed;
