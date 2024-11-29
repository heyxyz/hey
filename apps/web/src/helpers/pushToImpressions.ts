import { IS_MAINNET } from "@hey/data/constants";
import getCurrentSession from "./getCurrentSession";

/**
 * Push post to impressions queue
 * @param id Post ID
 * @returns void
 */
const pushToImpressions = (id: string): void => {
  const { id: sessionAccountId } = getCurrentSession();

  // Don't push impressions for the current user
  const postAccountId = id.split("-")[0];
  if (postAccountId === sessionAccountId) {
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
