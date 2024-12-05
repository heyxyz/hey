import type { Maybe, PostAction } from "@hey/indexer";
import allowedPostActionModules from "./allowedPostActionModules";

const isPostActionAllowed = (postActions?: Maybe<PostAction[]>): boolean => {
  if (!postActions?.length) {
    return false;
  }

  return postActions.some((postAction) => {
    const { __typename } = postAction;

    return allowedPostActionModules.includes(__typename);
  });
};

export default isPostActionAllowed;
