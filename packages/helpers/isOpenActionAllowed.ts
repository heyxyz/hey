import type { Maybe, OpenActionModule } from "@hey/indexer";
import allowedPostActionModules from "./allowedPostActionModules";

const isOpenActionAllowed = (
  openActions?: Maybe<OpenActionModule[]>
): boolean => {
  if (!openActions?.length) {
    return false;
  }

  return openActions.some((openAction) => {
    const { type } = openAction;

    return allowedPostActionModules.includes(type);
  });
};

export default isOpenActionAllowed;
