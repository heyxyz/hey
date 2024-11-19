import { IS_MAINNET } from "@hey/data/constants";
import getCurrentSession from "./getCurrentSession";

/**
 * Push post to impressions queue
 * @param id Post ID
 * @returns void
 */
const pushToImpressions = (id: string): void => {
  const { id: sessionProfileId } = getCurrentSession();

  // Don't push impressions for the current user
  const postProfileId = id.split("-")[0];
  if (postProfileId === sessionProfileId) {
    return;
  }

  if (IS_MAINNET && id && navigator.serviceWorker?.controller) {
    navigator.serviceWorker.controller.postMessage({
      id,
      type: "POST_IMPRESSION"
    });
  }

  return;
};

export default pushToImpressions;
