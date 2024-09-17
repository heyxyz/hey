import type { RelayErrorReasonType } from "@hey/lens";

import { Errors } from "@hey/data/errors";
import { LensProfileManagerRelayErrorReasonType } from "@hey/lens";
import { toast } from "react-hot-toast";

/**
 * Check and toast dispatcher error
 * @param reason - The reason
 * @returns true or false and toast error
 */
const checkAndToastDispatcherError = (
  reason: LensProfileManagerRelayErrorReasonType | RelayErrorReasonType
) => {
  if (reason === LensProfileManagerRelayErrorReasonType.RateLimited) {
    toast.error(Errors.RateLimited, { id: "error" });
    return false;
  }

  if (reason === LensProfileManagerRelayErrorReasonType.AppNotAllowed) {
    toast.error(Errors.AppNotAllowed, { id: "error" });
    return false;
  }

  return true;
};

export default checkAndToastDispatcherError;
